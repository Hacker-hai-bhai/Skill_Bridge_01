// --- AUTH GUARD ---
// This checks if the user is logged in before showing the page content
(function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    // If not logged in and not already on the login/index page, redirect
    if (!isLoggedIn && !window.location.pathname.includes('index.html')) {
        alert("Please login to access your dashboard.");
        window.location.href = 'index.html'; // Or 'login.html' if you have one
    }
})();

// --- Simple Login Logic ---
const loginBtn = document.querySelector('.login-trigger-btn'); // Add this class to your login button

if(loginBtn) {
    loginBtn.addEventListener('click', () => {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'student-profile.html'; // Redirect after "login"
    });
}

// --- Logout Logic ---
const logoutBtn = document.getElementById('logout-btn'); // Add to your sidebar
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });
}

