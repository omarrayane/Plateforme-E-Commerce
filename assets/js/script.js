document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Add focus effects or simple validation if needed
    loginForm.addEventListener('submit', (e) => {
        let valid = true;

        if (usernameInput.value.trim() === '') {
            valid = false;
            highlightInput(usernameInput);
        }

        if (passwordInput.value.length < 4) {
            valid = false;
            highlightInput(passwordInput);
        }

        if (!valid) {
            // We'll let the PHP handle the actual error display for now
            // but we could prevent default and show a JS alert/msg
        }
    });

    function highlightInput(input) {
        input.style.borderColor = '#ff3b30';
        setTimeout(() => {
            input.style.borderColor = '';
        }, 2000);
    }

    // Simple interaction: animate button on click
    const btn = document.querySelector('.login-btn');
    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'scale(0.95)';
    });
    btn.addEventListener('mouseup', () => {
        btn.style.transform = 'scale(1.02)';
    });
});
