document.getElementById('signUpButton').addEventListener('click', async () => {
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    // Validate input (basic example)
    if (!fullName || !email || !phone || !password) {
        showPopup('Please fill all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, phone, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showPopup('Sign Up Successful!');
            setTimeout(() => {
                window.location.href = '/login'; // Redirect to login page
            }, 2000);
        } else {
            showPopup(data.message || 'Sign Up Failed');
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
