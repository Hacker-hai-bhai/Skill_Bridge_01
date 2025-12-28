


document.addEventListener('DOMContentLoaded', () => {
    // --- Profile Editing Elements ---
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const cancelBtn = document.getElementById('cancel-profile-btn');

    const pic = document.getElementById('profile-picture');
    const picInput = document.getElementById('upload-pic');
    const picChangeBtn = document.querySelector('.edit-pic-btn');

    // Name and Bio in the main summary section (for display)
    const nameTextMain = document.getElementById('profile-name-main'); 
    const bioText = document.getElementById('profile-bio');

    // Name and Bio input fields (in the edit tab)
    const nameEdit = document.getElementById('name-edit');
    const bioEdit = document.getElementById('bio-edit');

    const skills = document.getElementById('skills-container');
    
    // --- State Storage ---
    let originalPic = pic ? pic.src : '';
    let originalName = nameTextMain ? nameTextMain.textContent : '';
    let originalBio = bioText ? bioText.textContent : '';
    let originalSkillsHTML = skills ? skills.innerHTML : ''; 

    // --- Tab Switching Logic ---
    function setupTabSwitching() {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove 'active' from all links and panels
                tabLinks.forEach(l => l.classList.remove('active'));
                tabPanels.forEach(p => p.style.display = 'none');

                // Add 'active' to clicked link and show corresponding panel
                link.classList.add('active');
                const targetId = link.getAttribute('data-tab');
                const targetPanel = document.getElementById(targetId);
                
                if (targetPanel) {
                    // Use 'grid' for the edit profile tab, 'block' for others
                    targetPanel.style.display = targetId === 'edit-profile' ? 'grid' : 'block'; 
                }

                // IMPORTANT: If switching away from Edit Profile while editing, cancel the edit mode
                if (targetId !== 'edit-profile') {
                    if (editBtn && editBtn.style.display === 'none') {
                        restoreOriginalValues();
                        exitEditMode();
                    }
                }
            });
        });
        
        // Ensure initial active panel uses 'grid' if it's the edit tab
        const initialActivePanel = document.querySelector('.tab-panel.active');
        if(initialActivePanel && initialActivePanel.id === 'edit-profile') {
             initialActivePanel.style.display = 'grid';
        }
    }

    // --- Profile Editing Helper Functions ---
    function restoreOriginalValues() {
        if (pic) pic.src = originalPic;
        if (nameTextMain) nameTextMain.textContent = originalName;
        if (bioText) bioText.textContent = originalBio;
        if (skills) skills.innerHTML = originalSkillsHTML; 
    }

    function exitEditMode() {
        if (picChangeBtn) picChangeBtn.style.display = 'none';
        
        // Hide edit actions
        if (document.getElementById('edit-actions')) document.getElementById('edit-actions').style.display = 'none';
        
        // Show edit button
        if (editBtn) editBtn.style.display = 'inline-block';
        
        // Disable edit mode for skills
        if (skills) skills.classList.remove('edit-mode');
        
        // Hide inputs (CSS handles display based on presence of .edit-mode class, 
        // but explicitly hiding the wrapper elements if needed for older browsers)
    }

    function createSkillTag(text) {
        if (!skills) return;
        const tag = document.createElement('span');
        tag.classList.add('skill-tag');
        tag.textContent = text;
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-skill');
        removeBtn.innerHTML = '&times;';
        tag.appendChild(removeBtn);
        const addSkillBtn = skills.querySelector('.add-skill');
        skills.insertBefore(tag, addSkillBtn);
    }
    
    // --- Event Listeners ---

    // 1. Edit Button Click
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            // Capture current state when entering edit mode
            originalName = nameTextMain.textContent;
            originalBio = bioText.textContent;
            originalSkillsHTML = skills.innerHTML; 

            editBtn.style.display = 'none';
            document.getElementById('edit-actions').style.display = 'flex';
            
            // Populate input fields
            if (nameEdit) nameEdit.value = originalName;
            if (bioEdit) bioEdit.value = originalBio;
            
            // Show edit elements
            if (picChangeBtn) picChangeBtn.style.display = 'inline-block';
            if (skills) skills.classList.add('edit-mode');
        });
    }

    // 2. Save Button Click
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Update the display text in the SUMMARY CARD
            if (nameTextMain && nameEdit) nameTextMain.textContent = nameEdit.value.trim() || originalName;
            if (bioText && bioEdit) bioText.textContent = bioEdit.value.trim();
            if (skills) originalSkillsHTML = skills.innerHTML; // Save new skills HTML state

            // Update profile completion (mock logic)
            const progressFill = document.getElementById('progress-bar-fill');
            const progressText = document.getElementById('progress-text');
            if (progressFill && progressText) {
                progressFill.style.width = '100%';
                progressText.textContent = '100%';
            }

            exitEditMode();
        });
    }

    // 3. Cancel Button Click
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            restoreOriginalValues();
            exitEditMode();
        });
    }

    // 4. Profile Picture Change Logic
    if (picChangeBtn && picInput) {
        picChangeBtn.addEventListener('click', () => picInput.click());
        picInput.addEventListener('change', () => {
            const file = picInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => { 
                    if (pic) pic.src = e.target.result;
                    originalPic = e.target.result; 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 5. Dynamic Skill Management Logic
    if (skills) {
        skills.addEventListener('click', e => {
            if (!skills.classList.contains('edit-mode')) return;

            const addSkillBtn = skills.querySelector('.add-skill');

            if (e.target.classList.contains('add-skill')) {
                if (skills.querySelector('.skill-input')) return;
                const input = document.createElement('input');
                input.type = 'text';
                input.classList.add('skill-input');
                input.placeholder = 'Type skill';
                skills.replaceChild(input, addSkillBtn);
                input.focus();

                function addAndRestore() {
                    const val = input.value.trim();
                    if (skills.contains(input)) {
                        skills.replaceChild(addSkillBtn, input);
                        if (val) createSkillTag(val);
                    }
                }
                input.addEventListener('blur', addAndRestore);
                input.addEventListener('keydown', ev => {
                    if (ev.key === 'Enter') { ev.preventDefault(); addAndRestore(); }
                    else if (ev.key === 'Escape') skills.replaceChild(addSkillBtn, input);
                });
            }

            if (e.target.classList.contains('remove-skill')) {
                e.target.parentElement.remove();
            }
        });
    }
    
    // Initialize tab switching
    setupTabSwitching();
});