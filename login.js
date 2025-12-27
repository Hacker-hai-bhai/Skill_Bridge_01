    // login.js
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('login-form');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');

            // 1. Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // 2. Find and Verify User
const user = users.find(u => u.email === email && u.password === password);

if (user) {
    // Standard session keys
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));

    // --- CRITICAL FIX FOR VIDEO CALL PAGE ---
    if (user.role === 'mentor') {
        localStorage.setItem('loggedInMentor', 'true');
        localStorage.removeItem('loggedInStudent'); // Ensure no conflict
    } else {
        localStorage.setItem('loggedInStudent', 'true');
        localStorage.removeItem('loggedInMentor'); // Ensure no conflict
    }
    // ----------------------------------------

    // Redirect based on role
    window.location.href = (user.role === 'mentor') ? 'mentor-profile.html' : 'student-profile.html';
}

            if (user) {
                // Set session keys
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));

                // Redirect based on role
                window.location.href = (user.role === 'mentor') ? 'mentor-profile.html' : 'student-profile.html';
            } else {
                errorElement.textContent = "Invalid email or password.";
                errorElement.style.display = "block";
                // Shake animation for error
                loginForm.parentElement.classList.add('shake');
                setTimeout(() => loginForm.parentElement.classList.remove('shake'), 500);
            }
        });
    });

    const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');

togglePassword.addEventListener('click', function () {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});