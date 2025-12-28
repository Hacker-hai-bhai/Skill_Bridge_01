// ===== VIDEO CALL PLACEHOLDER FUNCTIONALITY =====
let timerInterval;
let seconds = 0;
const timerDisplay = document.getElementById('timer');

const startCallBtn = document.getElementById('start-call');
const endCallBtn = document.getElementById('end-call');

startCallBtn.addEventListener('click', () => {
  seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    timerDisplay.textContent = 
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, 1000);
  alert("Starting video call (placeholder)...");
});

endCallBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerDisplay.textContent = "00:00";
  alert("Ending call (placeholder)...");
});

// Dummy mute toggle
document.getElementById('mute-audio').addEventListener('click', () => {
  alert("Toggling microphone (placeholder)...");
});

// Dummy camera toggle
document.getElementById('toggle-video').addEventListener('click', () => {
  alert("Toggling camera (placeholder)...");
});

// ===== SIDE CHAT DUMMY FUNCTIONALITY =====
const sideChatForm = document.getElementById('side-chat-form');
const sideMessageInput = document.getElementById('side-message-input');
const sideChatMessages = document.getElementById('side-chat-messages');

sideChatForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = sideMessageInput.value.trim();
  if (!text) return;
  const msgEl = document.createElement('div');
  msgEl.classList.add('message','sent');
  msgEl.innerHTML = `<p>${text}</p><span class="time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>`;
  sideChatMessages.appendChild(msgEl);
  sideMessageInput.value = '';
  sideChatMessages.scrollTop = sideChatMessages.scrollHeight;
});
