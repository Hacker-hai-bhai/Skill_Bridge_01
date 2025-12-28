// Payment Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters to populate booking details
    const urlParams = new URLSearchParams(window.location.search);
    
    // Mentor data from URL or default values
    const mentorName = urlParams.get('mentor') || 'Priya Sharma';
    const mentorSkill = urlParams.get('skill') || 'Expert in React & Frontend Performance';
    const mentorRating = urlParams.get('rating') || '4.5';
    const mentorImg = urlParams.get('img') || 'assets/images/mentor1.jpeg';
    // Price is already in rupees from URL, or use default Indian price
    const sessionPrice = parseFloat(urlParams.get('price')) || 800;
    const sessionDuration = urlParams.get('duration') || '1 hour';
    const sessionDateTime = urlParams.get('datetime') || 'Today at 2:00 PM IST';
    const sessionType = urlParams.get('type') || 'One-on-One';

    // Calculate total (session price + platform fee in rupees)
    const platformFee = 50;
    const totalAmount = sessionPrice + platformFee;

    // Format number with Indian number system (commas)
    function formatIndianCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }

    // Populate booking summary
    document.getElementById('mentor-name-summary').textContent = mentorName;
    document.getElementById('mentor-skill-summary').textContent = mentorSkill;
    document.getElementById('mentor-rating-summary').textContent = mentorRating;
    document.getElementById('mentor-img-summary').src = mentorImg;
    document.getElementById('session-duration').textContent = sessionDuration;
    document.getElementById('session-datetime').textContent = sessionDateTime;
    document.getElementById('session-type').textContent = sessionType;
    document.getElementById('session-price').textContent = formatIndianCurrency(sessionPrice);
    document.getElementById('platform-fee').textContent = formatIndianCurrency(platformFee);
    document.getElementById('total-amount').textContent = formatIndianCurrency(totalAmount);

    // Update payment amounts
    document.querySelectorAll('#pay-amount, #pay-amount-upi, #pay-amount-wallet, #pay-amount-netbanking').forEach(el => {
        el.textContent = totalAmount.toLocaleString('en-IN');
    });

    // Payment method switching
    const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
    const paymentForms = document.querySelectorAll('.payment-form');

    paymentMethodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and forms
            paymentMethodBtns.forEach(b => b.classList.remove('active'));
            paymentForms.forEach(f => {
                f.classList.remove('active');
                f.style.display = 'none';
            });

            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding form
            const method = btn.getAttribute('data-method');
            const form = document.querySelector(`.payment-form[data-payment-type="${method}"]`);
            if (form) {
                form.classList.add('active');
                form.style.display = 'block';
            }
        });
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // CVV - numbers only
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Form validation and submission
    const cardForm = document.getElementById('payment-form');
    const upiForm = document.getElementById('payment-form-upi');
    const walletForm = document.getElementById('payment-form-wallet');
    const netbankingForm = document.getElementById('payment-form-netbanking');
    const errorDiv = document.getElementById('payment-error');

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }

    function validateCardForm() {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        const cardholderName = document.getElementById('cardholder-name').value.trim();

        if (cardNumber.length < 13 || cardNumber.length > 19) {
            showError('Please enter a valid card number');
            return false;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            showError('Please enter a valid expiry date (MM/YY)');
            return false;
        }

        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        if (parseInt(month) < 1 || parseInt(month) > 12) {
            showError('Please enter a valid month (01-12)');
            return false;
        }

        if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showError('Card has expired');
            return false;
        }

        if (cvv.length < 3 || cvv.length > 4) {
            showError('Please enter a valid CVV');
            return false;
        }

        if (cardholderName.length < 2) {
            showError('Please enter cardholder name');
            return false;
        }

        return true;
    }

    function validateUPIForm() {
        const upiId = document.getElementById('upi-id').value.trim();
        // Indian UPI ID format: name@provider (e.g., yourname@paytm, yourname@ybl, yourname@phonepe, yourname@okaxis)
        if (!/^[\w\.-]+@(paytm|ybl|phonepe|okaxis|okhdfcbank|oksbi|okicici|okaxis|payzapp|freecharge|mobikwik)$/i.test(upiId)) {
            showError('Please enter a valid UPI ID (e.g., yourname@paytm, yourname@ybl, yourname@phonepe)');
            return false;
        }
        return true;
    }

    function processPayment(paymentMethod) {
        // Simulate payment processing
        const payButton = document.querySelector('.pay-now-btn');
        const originalText = payButton.innerHTML;
        
        payButton.disabled = true;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Simulate API call delay
        setTimeout(() => {
            // Generate booking ID
            const bookingId = 'SB-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
            document.getElementById('booking-id').textContent = bookingId;

            // Show success modal
            document.getElementById('success-modal').style.display = 'flex';

            // Reset button
            payButton.disabled = false;
            payButton.innerHTML = originalText;
        }, 2000);
    }

    // Card form submission
    if (cardForm) {
        cardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorDiv.classList.remove('show');

            if (validateCardForm()) {
                processPayment('card');
            }
        });
    }

    // UPI form submission
    if (upiForm) {
        upiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorDiv.classList.remove('show');

            if (validateUPIForm()) {
                processPayment('upi');
            }
        });
    }

    // Wallet form submission
    if (walletForm) {
        walletForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorDiv.classList.remove('show');

            const selectedWallet = document.querySelector('input[name="wallet"]:checked');
            if (!selectedWallet) {
                showError('Please select a wallet');
                return;
            }

            processPayment('wallet');
        });
    }

    // Net Banking form submission
    if (netbankingForm) {
        netbankingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorDiv.classList.remove('show');

            const selectedBank = document.getElementById('bank-select').value;
            if (!selectedBank) {
                showError('Please select a bank');
                return;
            }

            processPayment('netbanking');
        });
    }
});

// Close modal function
function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('success-modal');
    if (e.target === modal) {
        closeModal();
    }
});

