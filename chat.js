/* ===============================
   PERSON CONFIG (SYNC SIDEBAR + CHAT)
================================= */
const people = {
  ajay: {
    name: "Ajay Yadav",
    avatar: "assets/images/mentor1.jpeg",
    status: "online"
  },
  sudeep: {
    name: "Sudeep Kushwaha",
    avatar: "assets/images/mentor2.jpeg",
    status: "offline"
  }
};

/* ===============================
   CHAT DATA (DEMO)
================================= */
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

/* ===============================
   ELEMENT REFERENCES
================================= */
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

const chatSidebar = document.querySelector('.chat-sidebar');
const openSidebarBtn = document.querySelector('.open-sidebar');
const closeSidebarBtn = document.querySelector('.close-sidebar');

const fileInput = document.getElementById('file-input');
const attachDocumentBtn = document.getElementById('attach-document');
const attachPhotoVideoBtn = document.getElementById('attach-photo-video');
const attachAudioBtn = document.getElementById('attach-audio');

/* Image modal */
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');

let activePerson = 'ajay';

/* ===============================
   LOAD CHAT FUNCTION
================================= */
function loadChat(person) {
  chatMessages.innerHTML = '';
  const chats = chatData[person] || [];

  chats.forEach(msg => {
    const msgEl = document.createElement('div');
    msgEl.classList.add('message', msg.type);

    // IMAGE MESSAGE
    if (msg.msgType === 'image') {
      msgEl.classList.add('image-message');
      msgEl.innerHTML = `
        <p>
          <img src="${msg.src}" class="chat-image" alt="chat image">
        </p>
        <span class="time">${msg.time}</span>
      `;
    }
    // TEXT MESSAGE
    else {
      msgEl.innerHTML = `
        <p>${msg.text}</p>
        <span class="time">${msg.time}</span>
      `;
    }

    chatMessages.appendChild(msgEl);
  });

  /* ===== SYNC HEADER ===== */
  const personData = people[person];
  profileAvatar.src = personData.avatar;
  chatName.textContent = personData.name;

  if (personData.status === "online") {
    chatStatus.innerHTML = <i class="fas fa-circle"></i> Online;
    chatStatus.style.color = "#4CAF50";
  } else {
    chatStatus.innerHTML = <i class="fas fa-circle"></i> Offline;
    chatStatus.style.color = "gray";
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ===============================
   INIT
================================= */
loadChat(activePerson);

/* ===============================
   SEND TEXT MESSAGE
================================= */
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msgText = messageInput.value.trim();
  if (!msgText) return;

  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  chatData[activePerson].push({
    type: 'sent',
    text: msgText,
    time
  });

  loadChat(activePerson);
  messageInput.value = '';

  // Simulated reply
  typingIndicator.classList.remove('hidden');
  setTimeout(() => {
    typingIndicator.classList.add('hidden');
    chatData[activePerson].push({
      type: 'received',
      text: 'Got it!',
      time
    });
    loadChat(activePerson);
  }, 1500);
});

/* ===============================
   SIDEBAR SWITCH
================================= */
conversationItems.forEach(item => {
  item.addEventListener('click', () => {
    conversationItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    activePerson = item.dataset.person;
    loadChat(activePerson);

    if (window.innerWidth <= 768) {
      chatSidebar.classList.remove('open');
    }
  });
});

/* ===============================
   SIDEBAR TOGGLE (MOBILE)
================================= */
if (openSidebarBtn && closeSidebarBtn) {
  openSidebarBtn.addEventListener('click', () => chatSidebar.classList.add('open'));
  closeSidebarBtn.addEventListener('click', () => chatSidebar.classList.remove('open'));
}

/* ===============================
   ATTACHMENT MENU
================================= */
attachmentBtn.addEventListener('click', () => {
  attachmentMenu.classList.toggle('hidden');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.attachment-wrapper')) {
    attachmentMenu.classList.add('hidden');
  }
});

/* ===============================
   ATTACHMENT BUTTONS
================================= */
function handleFileSelection() {
  fileInput.click();
  attachmentMenu.classList.add('hidden');
}

attachDocumentBtn.addEventListener('click', handleFileSelection);
attachPhotoVideoBtn.addEventListener('click', handleFileSelection);
attachAudioBtn.addEventListener('click', handleFileSelection);

/* ===============================
   FILE UPLOAD HANDLER
================================= */
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  // IMAGE
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      chatData[activePerson].push({
        type: 'sent',
        msgType: 'image',
        src: reader.result,
        time
      });
      loadChat(activePerson);
    };
    reader.readAsDataURL(file);
  }
  // OTHER FILE
  else {
    chatData[activePerson].push({
      type: 'sent',
      text: 📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB),
      time
    });
    loadChat(activePerson);
  }

  fileInput.value = '';
});

/* ===============================
   IMAGE PREVIEW MODAL
================================= */
chatMessages.addEventListener('click', e => {
  if (e.target.classList.contains('chat-image')) {
    modalImage.src = e.target.src;
    imageModal.classList.remove('hidden');
  }
});

imageModal.addEventListener('click', () => {
  imageModal.classList.add('hidden');
  modalImage.src = '';
});

/* ===============================
   PROFILE CLICK
================================= */
profileAvatar.addEventListener('click', () => {
  window.location.href = 'profile.html';
});