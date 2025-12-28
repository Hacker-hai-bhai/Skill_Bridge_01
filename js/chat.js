// Chat Data (Demo for different people)
const chatData = {
  ajay: [
    { type: 'received', text: "Hi! Ready for our session?", time: "10:00 AM" },
    { type: 'sent', text: "Yes, I'm ready!", time: "10:01 AM" }
  ],
  sudeep: [
    { type: 'received', text: "Hey! How's your project going?", time: "Yesterday" },
    { type: 'sent', text: "Good, almost done!", time: "Yesterday" }
  ]
};

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const typingIndicator = document.getElementById('typing-indicator');
const attachmentBtn = document.querySelector('.attachment-btn');
const attachmentMenu = document.getElementById('attachment-menu');
const conversationItems = document.querySelectorAll('.conversation-list li');
const profileAvatar = document.getElementById('profile-avatar');
const chatName = document.getElementById('chat-name');
const chatStatus = document.getElementById('chat-status');

// Sidebar buttons for mobile view
const chatSidebar = document.querySelector('.chat-sidebar');
const openSidebarBtn = document.querySelector('.open-sidebar');
const closeSidebarBtn = document.querySelector('.close-sidebar');

let activePerson = 'ajay';

// Load chat messages for the selected person
function loadChat(person) {
  chatMessages.innerHTML = '';
  const chats = chatData[person] || [];
  chats.forEach(msg => {
    const msgEl = document.createElement('div');
    msgEl.classList.add('message', msg.type);
    msgEl.innerHTML = `<p>${msg.text}</p><span class="time">${msg.time}</span>`;
    chatMessages.appendChild(msgEl);
  });

  // Update header
  if (person === 'ajay') {
    profileAvatar.src = 'images/M1.jpg';
    chatName.textContent = 'Ajay Yadav';
    chatStatus.innerHTML = `<i class="fas fa-circle"></i> Online`;
  } else if (person === 'sudeep') {
    profileAvatar.src = 'images/M2.jpg';
    chatName.textContent = 'Sudeep Kushwaha';
    chatStatus.innerHTML = `<i class="fas fa-circle" style="color:gray"></i> Offline`;
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize default chat
loadChat(activePerson);

// Handle send message
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msgText = messageInput.value.trim();
  if (!msgText) return;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  chatData[activePerson].push({ type: 'sent', text: msgText, time });
  loadChat(activePerson);
  messageInput.value = '';

  // Simulate reply
  typingIndicator.classList.remove('hidden');
  setTimeout(() => {
    typingIndicator.classList.add('hidden');
    chatData[activePerson].push({ type: 'received', text: 'Got it!', time });
    loadChat(activePerson);
  }, 2000);
});

// Sidebar conversation switch
conversationItems.forEach(item => {
  item.addEventListener('click', () => {
    conversationItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    activePerson = item.dataset.person;
    loadChat(activePerson);
    if (window.innerWidth <= 768) chatSidebar.classList.remove('open');
  });
});

// Sidebar toggle for mobile
if (openSidebarBtn && closeSidebarBtn && chatSidebar) {
  openSidebarBtn.addEventListener('click', () => chatSidebar.classList.add('open'));
  closeSidebarBtn.addEventListener('click', () => chatSidebar.classList.remove('open'));
}

// Attachment menu toggle
attachmentBtn.addEventListener('click', () => {
  attachmentMenu.classList.toggle('hidden');
});

// Close attachment menu on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.attachment-wrapper')) {
    attachmentMenu.classList.add('hidden');
  }
});

// Redirect to profile page when avatar clicked
profileAvatar.addEventListener('click', () => {
  window.location.href = 'profile.html';
});
// --- Attachment Menu Functionality ---

// 1. Get references to the new elements
const fileInput = document.getElementById('file-input');
const attachDocumentBtn = document.getElementById('attach-document');
const attachPhotoVideoBtn = document.getElementById('attach-photo-video');
const attachAudioBtn = document.getElementById('attach-audio');

// Function to handle the file selection
function handleFileSelection() {
    // Programmatically click the hidden file input
    fileInput.click();

    // Close the attachment menu immediately after initiating the file selection
    attachmentMenu.classList.add('hidden'); 
}

// 2. Add event listeners to the menu buttons
attachDocumentBtn.addEventListener('click', () => {
    // You could optionally modify the 'accept' attribute here for stricter filtering
    // fileInput.accept = ".pdf, .doc, .docx, .txt";
    handleFileSelection();
});

attachPhotoVideoBtn.addEventListener('click', () => {
    // fileInput.accept = "image/*, video/*";
    handleFileSelection();
});

attachAudioBtn.addEventListener('click', () => {
    // fileInput.accept = "audio/*";
    handleFileSelection();
});

// 3. Handle file change event (When user selects a file)
fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        const file = files[0];
        const fileName = file.name;
        
        // **Simulation of sending a file message:**
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Determine file type icon for display
        let icon = '📄';
        if (file.type.startsWith('image')) icon = '🖼️';
        else if (file.type.startsWith('video')) icon = '🎥';
        else if (file.type.startsWith('audio')) icon = '🎵';

        const fileMessageText = `${icon} File: ${fileName} (${(file.size / 1024).toFixed(2)} KB) `;

        // Add the message to the chat data
        chatData[activePerson].push({ type: 'sent', text: fileMessageText, time });
        loadChat(activePerson);
        
        // Clear the file input value so the change event fires again if the user selects the same file
        fileInput.value = ''; 
    }
});