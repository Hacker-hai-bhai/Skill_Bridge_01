// Tab switch functionality (already present)
const tabButtons = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form');


tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const target = button.getAttribute('data-tab');
        forms.forEach(form => {
            form.classList.remove('active');
            if (form.id === target) form.classList.add('active');
            // Clear form on tab switch
            form.reset();
            form.querySelector('.form-error').textContent = '';
            [...form.querySelectorAll('input')].forEach(input =>
                input.classList.remove('invalid'));
        });
    });
});

// Password strength checker: min 6 chars, 1 uppercase, 1 number, 1 special character
function isStrongPassword(password) {
    const strongPasswordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    return strongPasswordRegex.test(password);
}

// Login validation
const loginForm = document.querySelector('#login');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const errorDiv = loginForm.querySelector('.form-error');
        let valid = true;
        errorDiv.textContent = '';

        const email = loginForm.querySelector('input[type="email"]');
        const password = loginForm.querySelector('input[type="password"]');

        // Email required and format
        if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
            email.classList.add('invalid');
            errorDiv.textContent = 'Enter a valid email.';
            valid = false;
        } else {
            email.classList.remove('invalid');
        }

        // Password required and strong
        if (!password.value.trim() || !isStrongPassword(password.value)) {
            password.classList.add('invalid');
            errorDiv.textContent +=
                (errorDiv.textContent ? ' ' : '') +
                'Password must be at least 6 characters and include 1 uppercase letter, 1 number, and 1 special character.';
            valid = false;
        } else {
            password.classList.remove('invalid');
        }

        if (valid) {
            // Get selected role
            const roleRadio = loginForm.querySelector('input[name="role-login"]:checked');
            const role = roleRadio ? roleRadio.parentElement.textContent.trim() : '';
            if (role === "Student") {
                localStorage.setItem('loggedInStudent', 'true');
                window.location.href = "student-profile.html";
            } else if (role === "Mentor") {
                localStorage.setItem('loggedInMentor', 'true');
                window.location.href = "mentor-profile.html";
            } else {
                errorDiv.textContent = "Please select your role.";
            }
        }
    });
}

// Signup validation
const signupForm = document.querySelector('#signup');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const errorDiv = signupForm.querySelector('.form-error');
        let valid = true;
        errorDiv.textContent = '';

        const name = signupForm.querySelector('input[type="text"]');
        const email = signupForm.querySelector('input[type="email"]');
        const passwords = signupForm.querySelectorAll('input[type="password"]');
        const password = passwords[0];
        const confirmPassword = passwords[1];

        // Name required
        if (!name.value.trim()) {
            name.classList.add('invalid');
            errorDiv.textContent = 'Name is required.';
            valid = false;
        } else {
            name.classList.remove('invalid');
        }

        // Email required and format
        if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
            email.classList.add('invalid');
            errorDiv.textContent += (errorDiv.textContent ? ' ' : '') + 'Enter a valid email.';
            valid = false;
        } else {
            email.classList.remove('invalid');
        }

        // Password strong
        if (!password.value || !isStrongPassword(password.value)) {
            password.classList.add('invalid');
            errorDiv.textContent +=
                (errorDiv.textContent ? ' ' : '') +
                'Password must be at least 6 characters and include 1 uppercase letter, 1 number, and 1 special character.';
            valid = false;
        } else {
            password.classList.remove('invalid');
        }

        // Passwords must match
        if (password.value !== confirmPassword.value) {
            confirmPassword.classList.add('invalid');
            errorDiv.textContent += (errorDiv.textContent ? ' ' : '') + "Passwords don't match.";
            valid = false;
        } else {
            confirmPassword.classList.remove('invalid');
        }

        if (valid) {
            // Simulate signup (can customize for role later)
            alert("Sign up successful! Please login.");
            tabButtons[0].click(); // Switch to Login tab after successful signup
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login");
    const signupForm = document.getElementById("signup");
    const forgetForm = document.getElementById("forget_password");
    const forgotLink = document.querySelector(".forgot");
    const tabs = document.querySelector(".tabs");

    forgotLink.addEventListener("click", function (e) {
        e.preventDefault();

        // Hide login & signup
        loginForm.classList.remove("active");
        signupForm.classList.remove("active");

        // Hide tabs
        tabs.style.display = "none";

        // Show forget password
        forgetForm.classList.add("active");
    });
});


// ===== Forget Password Flow =====
const fpEmailStep = document.getElementById("fp-email");
const fpOtpStep = document.getElementById("fp-otp");
const fpPasswordStep = document.getElementById("fp-password");
const fpError = document.querySelector("#forget_password .form-error");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

// STEP 1 → STEP 2 (Email → OTP)
sendOtpBtn.addEventListener("click", () => {
    const email = document.getElementById("fpEmail").value.trim();

    fpError.textContent = "";

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        fpError.textContent = "Enter a valid email.";
        return;
    }

    // Simulate OTP sent
    fpEmailStep.classList.remove("active");
    fpOtpStep.classList.add("active");
});

// STEP 2 → STEP 3 (OTP → Password)
verifyOtpBtn.addEventListener("click", () => {
    const otp = document.getElementById("fpOtp").value.trim();

    fpError.textContent = "";

    if (!otp || otp.length < 4) {
        fpError.textContent = "Enter a valid OTP.";
        return;
    }

    fpOtpStep.classList.remove("active");
    fpPasswordStep.classList.add("active");
});

// FINAL STEP (Update Password)
document.getElementById("forget_password").addEventListener("submit", function (e) {
    e.preventDefault();

    const newPass = document.getElementById("newPassword");
    const confirmPass = document.getElementById("confirmPassword");

    fpError.textContent = "";

    if (!isStrongPassword(newPass.value)) {
        fpError.textContent =
            "Password must be at least 6 characters and include 1 uppercase letter, 1 number, and 1 special character.";
        return;
    }

    if (newPass.value !== confirmPass.value) {
        fpError.textContent = "Passwords do not match.";
        return;
    }

    alert("Password updated successfully! Please login.");

    // Reset everything
    this.reset();
    fpPasswordStep.classList.remove("active");
    fpEmailStep.classList.add("active");
});

