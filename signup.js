document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const roleBoxes = document.querySelectorAll('.role-box');

    // Handle role selection UI
    roleBoxes.forEach(box => {
        box.addEventListener('click', () => {
            roleBoxes.forEach(b => b.classList.remove('active'));
            box.classList.add('active');
        });
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const role = document.querySelector('input[name="role"]:checked').value;

        // 1. Get existing users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // 2. Check if email already exists
        const exists = users.find(user => user.email === email);
        if (exists) {
            alert("This email is already registered. Please login.");
            return;
        }

        // 3. Save new user
        const newUser = { name, email, password, role };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert("Registration Successful! Please login to continue.");
        window.location.href = 'login.html';
    });
});