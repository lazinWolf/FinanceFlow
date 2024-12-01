document.getElementById('loginButton').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate input (basic example)
    if (!email || !password) {
        showPopup('Please fill all fields');
        return;
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showPopup('Login Successful!');
            setTimeout(() => {
                window.location.href = '/dashboard'; // Redirect to dashboard or desired page
            }, 2000);
        } else {
            showPopup(data.message || 'Login Failed');
        }
    } catch (error) {
        showPopup('An error occurred. Please try again.');
        console.error(error);
    }
});

// Helper function to display popups
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;
    popup.style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}
