document.addEventListener('DOMContentLoaded', () => {
    // === 1. Selectors ===
    const toggleBtn = document.getElementById('sidebar-toggle');
    const wrapper = document.querySelector('.dashboard-wrapper');
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Profile Selectors
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const cancelBtn = document.getElementById('cancel-profile-btn');
    const pic = document.getElementById('profile-picture');
    const picInput = document.getElementById('upload-pic');
    const picChangeBtn = document.querySelector('.edit-pic-btn');
    const nameText = document.getElementById('profile-name-main'); 
    const nameEdit = document.getElementById('name-edit');
    const bioText = document.getElementById('profile-bio');
    const bioEdit = document.getElementById('bio-edit');
    const editSkills = document.getElementById('skills-container');
    const summarySkills = document.getElementById('profile-skills-summary'); 
    const progressText = document.getElementById('progress-text');
    const progressBarFill = document.getElementById('progress-bar-fill');
    
    // Mentor Selectors
    const mentorSearchInput = document.getElementById('mentor-search');
    const mentorFilterDropdown = document.getElementById('mentor-filter');
    const mentorCards = document.querySelectorAll('.mentor-card-lg'); 

    // Data Storage for Reset
    let originalPic, originalName, originalBio, originalEditSkillsHTML; 

    // ==========================================================
    // === 2. Profile Logic ===
    // ==========================================================
    if (editBtn) {
        // Capture initial state for Cancel functionality
        originalPic = pic.src;
        originalName = nameText.textContent.trim(); 
        originalBio = bioText.textContent.trim(); 
        originalEditSkillsHTML = editSkills ? editSkills.innerHTML : '';

        function updateSummarySkills() {
            if (!summarySkills || !editSkills) return;
            const skillTagsText = Array.from(editSkills.querySelectorAll('.skill-tag'))
                .filter(tag => !tag.classList.contains('add-skill'))
                .map(tag => tag.childNodes[0].textContent.trim()); 
            
            summarySkills.innerHTML = skillTagsText.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
        }

        function toggleEditMode(isEditing) {
            if (picChangeBtn) picChangeBtn.style.display = isEditing ? 'block' : 'none';
            if (editBtn) editBtn.style.display = isEditing ? 'none' : 'inline-block';
            
            const editActions = document.getElementById('edit-actions');
            if (editActions) editActions.style.display = isEditing ? 'flex' : 'none';
            if (editSkills) isEditing ? editSkills.classList.add('edit-mode') : editSkills.classList.remove('edit-mode');
            
            if (nameText && nameEdit) {
                nameText.style.display = isEditing ? 'none' : 'block';
                nameEdit.style.display = isEditing ? 'block' : 'none';
                if (isEditing) nameEdit.value = nameText.textContent.trim();
            }
            if (bioText && bioEdit) {
                bioText.style.display = isEditing ? 'none' : 'block';
                bioEdit.style.display = isEditing ? 'block' : 'none';
                if (isEditing) bioEdit.value = bioText.textContent.trim();
            }
        }

        function calculateAndSetProgress() {
            if (!progressBarFill) return;
            let score = 0;
            const totalPoints = 5; 
            
            if (pic.src && !pic.src.includes('placeholder')) score++;
            if (nameText.textContent.trim().length > 0) score++;
            if (bioText.textContent.trim().length > 20) score++;
            if (editSkills && editSkills.querySelectorAll('.skill-tag:not(.add-skill)').length >= 1) score++;
            if (bioText.textContent.trim().length >= 50) score++;

            const percentage = Math.round((score / totalPoints) * 100);
            progressText.textContent = `${percentage}%`;
            progressBarFill.style.width = `${percentage}%`;
        }

        editBtn.addEventListener('click', () => toggleEditMode(true));
        
        cancelBtn.addEventListener('click', () => {
            pic.src = originalPic;
            editSkills.innerHTML = originalEditSkillsHTML;
            toggleEditMode(false);
        });

        saveBtn.addEventListener('click', () => {
            nameText.textContent = nameEdit.value;
            bioText.textContent = bioEdit.value;
            // Update original state to new saved values
            originalName = nameEdit.value;
            originalBio = bioEdit.value;
            originalEditSkillsHTML = editSkills.innerHTML;
            
            updateSummarySkills();
            calculateAndSetProgress();
            toggleEditMode(false);
        });

        if (picChangeBtn) {
            picChangeBtn.addEventListener('click', () => picInput.click());
            picInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) pic.src = URL.createObjectURL(file);
            });
        }

        // Handle Adding/Removing Skills (Event Delegation)
        if (editSkills) {
            editSkills.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-skill') && editSkills.classList.contains('edit-mode')) {
                    const newSkill = prompt("Enter skill name:");
                    if (newSkill) {
                        const tag = document.createElement('span');
                        tag.className = 'skill-tag';
                        tag.innerHTML = `${newSkill} <button class="remove-skill">&times;</button>`;
                        editSkills.insertBefore(tag, e.target);
                    }
                } else if (e.target.classList.contains('remove-skill')) {
                    e.target.parentElement.remove();
                }
            });
        }

        calculateAndSetProgress();
    }

    // ==========================================================
    // === 3. Tab Switching Logic ===
    // ==========================================================
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTabId = link.dataset.tab;
            
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanels.forEach(p => p.style.display = 'none');

            link.classList.add('active');
            const targetPanel = document.getElementById(targetTabId);
            if (targetPanel) {
                // Keep the grid layout for profile, block for others
                targetPanel.style.display = (targetTabId === 'edit-profile') ? 'grid' : 'block';
            }
        });
    });

    // ==========================================================
    // === 4. Mentor Search & Filter ===
    // ==========================================================
    function filterMentors() {
        if (!mentorSearchInput || !mentorFilterDropdown || mentorCards.length === 0) return; 

        const searchTerm = mentorSearchInput.value.toLowerCase().trim();
        const filterValue = mentorFilterDropdown.value.toLowerCase();

        mentorCards.forEach(card => {
            const name = card.querySelector('h4').textContent.toLowerCase();
            // Look for the strong tag inside mentor-tagline or focus area
            const tagline = card.querySelector('.mentor-tagline').textContent.toLowerCase();
            const focus = card.querySelector('.mentor-details').textContent.toLowerCase();
            
            const matchesSearch = name.includes(searchTerm) || tagline.includes(searchTerm) || focus.includes(searchTerm);
            const matchesFilter = filterValue === 'all' || tagline.includes(filterValue) || focus.includes(filterValue);
            
            card.style.display = (matchesSearch && matchesFilter) ? 'flex' : 'none';
        });
    }

    if (mentorSearchInput) mentorSearchInput.addEventListener('keyup', filterMentors);
    if (mentorFilterDropdown) mentorFilterDropdown.addEventListener('change', filterMentors);

    // ==========================================================
    // === 5. Sidebar Toggle ===
    // ==========================================================
    if (toggleBtn && wrapper) {
        toggleBtn.addEventListener('click', () => {
            wrapper.classList.toggle('sidebar-open');
        });
    }
});

// ==========================================================
// === 7. Booking Logic (Student Dashboard) ===
// ==========================================================
const bookingModal = document.getElementById('booking-modal');
const bookBtns = document.querySelectorAll('.book-session-btn');
const closeModal = document.querySelector('.close-modal');
const confirmBookingBtn = document.getElementById('confirm-booking-btn');
let selectedMentorName = "";

// 1. Open Modal when a mentor's book button is clicked
bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.mentor-card-lg');
        selectedMentorName = card.querySelector('h4').textContent;
        document.getElementById('modal-mentor-name').textContent = selectedMentorName;
        bookingModal.style.display = 'block';
    });
});

// 2. Close Modal
if(closeModal) {
    closeModal.onclick = () => bookingModal.style.display = 'none';
}

// 3. Confirm Booking
if(confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
        const dateTime = document.getElementById('booking-datetime').value;
        const topic = document.getElementById('booking-topic').value;

        if(!dateTime || !topic) {
            alert("Please select a time and enter a topic.");
            return;
        }

        // Logic: Add to "My Activity" tab
        const activityList = document.querySelector('.activity-list');
        const newActivity = document.createElement('li');
        newActivity.className = 'activity-item';
        newActivity.innerHTML = `
            <span class="activity-date">${new Date(dateTime).toLocaleString()}</span>
            <span class="activity-description">Requested session with ${selectedMentorName}: "${topic}"</span>
            <span class="activity-status status-upcoming">Pending</span>
        `;
        
        // Insert at the top of the list
        activityList.insertBefore(newActivity, activityList.firstChild);

        alert(`Request sent to ${selectedMentorName}!`);
        bookingModal.style.display = 'none';
        
        // Optional: Switch to Activity tab to show the user it was added
        document.querySelector('[data-tab="my-activity"]').click();
    });
}
// ==========================================================
// === 8. Mentor Dashboard: Request to Schedule Workflow ===
// ==========================================================
const requestsList = document.getElementById('requests-list');
const scheduleList = document.getElementById('schedule-list');

if (requestsList && scheduleList) {
    requestsList.addEventListener('click', (e) => {
        const btn = e.target;
        const requestCard = btn.closest('.request-card');
        if (!requestCard) return;

        const studentName = requestCard.querySelector('strong').textContent;
        const topicInfo = requestCard.querySelector('p').textContent;
        const dateInfo = requestCard.querySelector('.activity-date').textContent;

        if (btn.classList.contains('accept-btn')) {
            // 1. Visual feedback
            alert(`You have accepted the session with ${studentName}!`);
            requestCard.style.borderLeft = "5px solid var(--success-color)";
            requestCard.style.transition = "all 0.5s ease";
            requestCard.style.opacity = "0";

            // 2. Create new item for the Schedule tab
            const newScheduleItem = document.createElement('li');
            newScheduleItem.className = 'activity-item';
            newScheduleItem.innerHTML = `
                <span class="activity-date">${dateInfo.replace('Request for: ', '')}</span>
                <span class="activity-description">Session with <strong>${studentName}</strong> (${topicInfo.replace('Topic: ', '')})</span>
                <span class="activity-status status-upcoming">Confirmed</span>
            `;

            // 3. Move to schedule and remove from requests
            setTimeout(() => {
                scheduleList.appendChild(newScheduleItem);
                requestCard.remove();
                
                // Optional: Check if list is empty to show "No pending requests"
                if (requestsList.children.length === 0) {
                    requestsList.innerHTML = '<p style="padding: 20px; color: var(--text-muted);">No new requests.</p>';
                }
            }, 500);

        } else if (btn.classList.contains('reject-btn')) {
            if (confirm(`Are you sure you want to decline this request from ${studentName}?`)) {
                requestCard.style.opacity = "0.3";
                setTimeout(() => requestCard.remove(), 500);
            }
        }
    });
}