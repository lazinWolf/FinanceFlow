// login.js
// Get form and elements
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const loginButton = document.getElementById("loginButton");

// Event listener for the login button
loginButton.addEventListener("click", async function(event) {
    // Prevent form submission behavior
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Validate email and password
    if (email === "" || password === "") {
        alert("Please fill in both email and password.");
    } else if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
    } else {
        try {
            // Make API call to login endpoint
            const response = await fetch('/api/auth/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // Login successful
                const data = await response.json(); 

                // Store JWT in local storage
                localStorage.setItem('token', data.token); 

                showPopup("Login Successful!");

                // Wait for the popup, then redirect to dashboard
                setTimeout(function() {
                    window.location.href = "/dashboard"; 
                }, 2000);

            } else {
                // Handle error response (including incorrect password)
                const errorData = await response.json();

                // Check if the error is specifically about the password
                if (errorData.message === 'Invalid email or password') { 
                    alert("Incorrect password. Please try again.");
                } else {
                    // For other errors, display the generic error message
                    alert(`Login failed: ${errorData.message}`); 
                }
            }

        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login.");
        }
    }
});

// Function to show the popup
function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = "block";
}

// Function to close the popup
function closePopup() {
    popup.style.display = "none";
}

// Close popup if clicked outside
window.onclick = function(event) {
    if (event.target === popup) {
        closePopup();
    }
}