// signup.js
// Get form and elements 
const form = document.getElementById("signUpForm");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const signUpButton = document.getElementById("signUpButton");

// Event listener for the sign-up button
signUpButton.addEventListener("click", async function(event) {
    // Prevent form submission behavior
    event.preventDefault();

    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const password = passwordInput.value;

    // Validate if all fields are filled
    if (fullName === "" || email === "" || phone === "" || password === "") {
        alert("Please fill in all fields.");
    } else if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
    } else {
        try {
            // Make API call to signup endpoint
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, email, phone, password })
            });

            if (response.ok) {
                // Signup successful
                showPopup("Sign Up Successful!");

                // Wait for the popup to appear, then redirect to dashboard
                setTimeout(function() {
                    window.location.href = "/login"; 
                }, 2000); 

            } else {
                // Handle error response
                const errorData = await response.json(); 
                alert(`Signup failed: ${errorData.message}`); 
            }

        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred during signup.");
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