// --- CRITICAL: Add these missing element and state variables ---

// Side chat elements
const sideChatForm = document.getElementById('side-chat-form');
const sideMessageInput = document.getElementById('side-message-input');
const sideFileInput = document.getElementById('side-file-input');
const fileBtn = document.getElementById('file-btn'); // Correct ID from HTML
const sideChatMessages = document.getElementById('side-chat-messages');
const overlay = document.getElementById('image-overlay');
const enlargedImg = document.getElementById('enlarged-img');

// Video call elements
const localVideo = document.querySelector('.local-video video');
const remoteVideo = document.querySelector('.remote-video video');
const startCallBtn = document.getElementById('start-call');
const endCallBtn = document.getElementById('end-call');
const muteAudioBtn = document.getElementById('mute-audio');
const toggleVideoBtn = document.getElementById('toggle-video');
const screenShareBtn = document.getElementById('screen-share'); // <--- CRITICAL FIX: Select existing button
const timerDisplay = document.getElementById('timer');

// State Variables
let localStream = null;
let peerConnection = null;
let timerInterval;
let seconds = 0;
let screenStream = null; // State for screen share stream
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// User Role Definition: Check localStorage to set the sender role dynamically
const userRole = localStorage.getItem('loggedInStudent') 
    ? 'Student' 
    : (localStorage.getItem('loggedInMentor') 
        ? 'Mentor' 
        : 'Guest'); // Default to 'Guest' if neither is set


const socket = io('http://localhost:3000');

// --- START: REFINED ROOM ID LOGIC ---
// Get the room ID from the URL parameters (e.g., ?room=xyz789)
const urlParams = new URLSearchParams(window.location.search);
let roomId = urlParams.get('room');

// If no room ID is in the URL, generate one and redirect to it
if (!roomId) {
  roomId = Math.random().toString(36).substring(2, 9);
  window.location.href = `video-call.html?room=${roomId}`;
}

// --- START: CORRECTED SIDE CHAT SEND MESSAGE/FILE ---
function enlargeImage(src) {
    const overlay = document.getElementById('image-overlay');
    const enlargedImg = document.getElementById('enlarged-img');
    if (overlay && enlargedImg) {
        enlargedImg.src = src;
        overlay.style.display = 'flex';
    }
}

// --- START: Time Utility Function ---
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}
// --- END: Time Utility Function ---

console.log('Joining Room:', roomId);

fileBtn.addEventListener('click', () => sideFileInput.click());

socket.emit('joinRoom', roomId);

sideChatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = sideMessageInput.value.trim();
    const file = sideFileInput.files[0];
    
    if (!message && !file) return;

    // FIX: Use the dynamically defined userRole
    const sender = userRole; 
    
    // Data structure to be sent to server and appended locally
    const messageData = {
        room: roomId,
        message,
        sender,
        isFile: false,
        fileName: '',
        fileType: '',
        fileData: ''
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            // Update messageData with file details
            messageData.isFile = true;
            messageData.fileName = file.name;
            messageData.fileType = file.type;
            messageData.fileData = reader.result;

            // 1. Instantly display the message on the sender's screen
            appendMessage(messageData); 
            
            // 2. Send to server for the other user
            socket.emit('sendMessage', messageData); 
            
            sideFileInput.value = null; // Reset file input
        };
        reader.readAsDataURL(file);
    } else {
        // 1. Instantly display the message on the sender's screen
        appendMessage(messageData); 

        // 2. Send to server for the other user
        socket.emit('sendMessage', messageData);
    }
    
    sideMessageInput.value = '';
});
// --- END: CORRECTED SIDE CHAT SEND MESSAGE/FILE ---


// Screen share control
screenShareBtn.addEventListener('click', async () => {
    const icon = screenShareBtn.querySelector('i');
    
    if (!screenStream) {
        // Start Screen Share
        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];
            const sender = peerConnection ? peerConnection.getSenders().find(s => s.track.kind === 'video') : null;

            if (sender) {
                sender.replaceTrack(screenTrack);
            }

            // UI Update
            screenShareBtn.classList.add('sharing');
            icon.className = 'fas fa-stop-circle'; // Show a "stop" icon
            screenShareBtn.setAttribute('aria-label', 'Stop Sharing');
            
            // Revert when user clicks stop in browser dialog
            screenTrack.onended = () => {
                if (localStream) {
                    const videoTrack = localStream.getVideoTracks()[0];
                    if (sender) {
                        sender.replaceTrack(videoTrack);
                    }
                }
                screenStream = null;
                // UI Revert
                screenShareBtn.classList.remove('sharing');
                icon.className = 'fas fa-desktop';
                screenShareBtn.setAttribute('aria-label', 'Share Screen');
            };
        } catch (err) {
            console.error("Error accessing display media:", err);
            screenStream = null;
        }
    } else {
        // Stop Screen Share
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;

        // Revert local camera
        if (localStream) {
            const sender = peerConnection ? peerConnection.getSenders().find(s => s.track.kind === 'video') : null;
            if (sender) {
                const videoTrack = localStream.getVideoTracks()[0];
                sender.replaceTrack(videoTrack);
            }
        }
        
        // UI Revert
        screenShareBtn.classList.remove('sharing');
        icon.className = 'fas fa-desktop';
        screenShareBtn.setAttribute('aria-label', 'Share Screen');
    }
});

// Video call control
startCallBtn.addEventListener('click', async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(config);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = event => remoteVideo.srcObject = event.streams[0];

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('iceCandidate', { candidate: event.candidate, room: roomId });
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('videoOffer', { offer, room: roomId });

    seconds = 0;
    timerDisplay.textContent = '00:00';
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      seconds++;
      const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
  } catch (err) {
    console.error('Media error:', err);
  }
});

endCallBtn.addEventListener('click', () => {
  if (peerConnection) peerConnection.close(), peerConnection = null;
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
  clearInterval(timerInterval);
  timerDisplay.textContent = '00:00';
  alert('Call ended.');
});

// Corrected Mute Audio Logic
muteAudioBtn.addEventListener('click', () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    
    // UI Update
    const icon = muteAudioBtn.querySelector('i');
    const isMuted = !audioTrack.enabled;

    muteAudioBtn.classList.toggle('muted', isMuted);
    icon.className = isMuted ? 'fas fa-microphone-slash' : 'fas fa-microphone';
    muteAudioBtn.setAttribute('aria-label', isMuted ? 'Unmute Audio' : 'Toggle Mute');
});

// Corrected Toggle Video Logic
toggleVideoBtn.addEventListener('click', () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    
    // UI Update
    const icon = toggleVideoBtn.querySelector('i');
    const isVideoOff = !videoTrack.enabled;
    
    toggleVideoBtn.classList.toggle('muted', isVideoOff);
    icon.className = isVideoOff ? 'fas fa-video-slash' : 'fas fa-video';
    toggleVideoBtn.setAttribute('aria-label', isVideoOff ? 'Turn Video On' : 'Toggle Video');
});

// --- WebRTC Signaling Listeners ---

socket.on('videoOffer', async ({ offer }) => {
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection(config);
    peerConnection.ontrack = event => (remoteVideo.srcObject = event.streams[0]);
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('iceCandidate', { candidate: event.candidate, room: roomId });
      }
    };
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  }
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('videoAnswer', { answer, room: roomId });
});

socket.on('videoAnswer', async ({ answer }) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('iceCandidate', async ({ candidate }) => {
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (err) {
    console.error('ICE candidate error:', err);
  }
});

// --- START: SIDE CHAT RECEIVE MESSAGE/FILE (CONSOLIDATED & CLEANED) ---
function appendMessage({ message, sender, isFile, fileName, fileType, fileData }) {
    const isSent = (sender === userRole);
    const msgEl = document.createElement('div');
    msgEl.classList.add('message', isSent ? 'sent' : 'received');
    const currentTime = formatTime(new Date()); 

    let contentHTML = '';

    if (isFile && fileData) {
        const fileText = message ? `<p>${message}</p>` : '';
        
        if (fileType.startsWith('image/')) {
            // FIX: Ensure the <div> is opened before the <img>
            contentHTML = `
                <div class="message-content">
                    <p class="file-info"><strong>${fileName}</strong></p>
                    ${fileText}
                    <img src="${fileData}" 
                         alt="${fileName}" 
                         onclick="enlargeImage('${fileData}')" 
                         style="max-width:100%; height:auto; display:block; border-radius: 12px; cursor: pointer;" />
                </div>
            `;
        } else {
            contentHTML = `
                <div class="message-content">
                    <p class="file-info">File: <strong>${fileName}</strong></p>
                    ${fileText}
                    <a href="${fileData}" download="${fileName}" class="btn secondary small-btn">Download File</a>
                </div>
            `;
        }
    } else {
        contentHTML = `<div class="message-content"><p>${message}</p></div>`;
    }
    
    msgEl.innerHTML = `
        <span class="sender-name">${isSent ? 'You' : sender}:</span>
        ${contentHTML}
        <span class="time">${currentTime}</span>
    `;

    sideChatMessages.appendChild(msgEl);
    sideChatMessages.scrollTop = sideChatMessages.scrollHeight;
}

// --- START: SIDE CHAT RECEIVE MESSAGE/FILE (CORRECTED) ---
// Socket listener for receiving messages (Call the dedicated function)
socket.on('receiveMessage', (data) => {
    // Pass the received data object directly to your existing rendering function
    appendMessage(data); 
});
// --- END: SIDE CHAT RECEIVE MESSAGE/FILE (CORRECTED) ---

// video-call.js

// Listen for when the other user disconnects
socket.on('peerDisconnected', (data) => {
    console.log('The other user has disconnected:', data.id);
    
    // 1. Alert the user
    alert('The other user has left the call.');

    // 2. Clean up the connection (reuse your existing end-call logic)
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    // 3. Reset UI
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    clearInterval(timerInterval);
    timerDisplay.textContent = '00:00';
});