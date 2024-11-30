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
signUpButton.addEventListener("click", function(event) {
    // Prevent form submission behavior
    event.preventDefault(); // This ensures the page won't refresh

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
        // Show success popup and then redirect after a short delay
        // showPopup("Sign Up Successful!");
        
        // Wait for the popup to appear for a short time, then redirect to dashboard
        setTimeout(function() {
            window.location.href = "dashboard.html"; // Redirect to dashboard
        }, 2000); // 2 seconds delay
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
