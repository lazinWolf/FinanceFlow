// Get form and elements
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const loginButton = document.getElementById("loginButton");

// Event listener for the login button
loginButton.addEventListener("click", function(event) {
    // Prevent form submission behavior
    event.preventDefault(); // This ensures the page won't refresh

    const email = emailInput.value;
    const password = passwordInput.value;

    // Validate email and password
    if (email === "" || password === "") {
        alert("Please fill in both email and password.");
    } else if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
    } else {
        // Show success popup and then redirect after a short delay
        showPopup("Login Successful!");
        
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
