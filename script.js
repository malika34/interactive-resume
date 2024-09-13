// Get elements from the DOM
var formContainer = document.getElementById("formContainer");
var showFormButton = document.getElementById("showForm");
var generateButton = document.getElementById("generateResume");
var resumeContainer = document.getElementById("resume");
var displayName = document.getElementById("display-name");
var displayEmail = document.getElementById("display-email");
var displayPhone = document.getElementById("display-phone");
var displayEducation = document.getElementById("display-education");
var displaySkills = document.getElementById("display-skills");
var displayExperience = document.getElementById("display-experience");
var profilePic = document.getElementById("profile-pic");
var profileImageInput = document.getElementById("profileImage");
var copyLinkButton = document.getElementById("copyLink");
var downloadPDFButton = document.getElementById("downloadPDF");
var generatedURL = document.getElementById("generatedURL");
var themeSelector = document.getElementById("theme");
var loadingBar = document.getElementById("loadingBar");
// Theme Change Logic
themeSelector.addEventListener("change", function () {
    var selectedTheme = themeSelector.value;
    document.body.className = ""; // Reset any previous theme
    if (selectedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
    else if (selectedTheme === "light") {
        document.body.classList.add("light-mode");
    }
});
// Show form when the button is clicked
showFormButton.addEventListener("click", function () {
    formContainer.style.display = "block";
    showFormButton.style.display = "none";
    resumeContainer.style.display = "none"; // Hide the resume while filling form
});
// Add event listener to the Generate Resume button
generateButton.addEventListener("click", function () {
    // Show loading bar
    loadingBar.style.display = "block";
    loadingBar.style.width = "0%";
    // Simulate form processing
    var width = 0;
    var interval = setInterval(function () {
        if (width >= 100) {
            clearInterval(interval);
            loadingBar.style.display = "none"; // Hide the loading bar after completion
            // Proceed with resume generation logic
            generateResume();
        }
        else {
            width += 10; // Increase width by 10% increments
            loadingBar.style.width = "".concat(width, "%");
        }
    }, 200);
});
// Function to handle resume generation
function generateResume() {
    // Get user input values
    var name = document.getElementById("name")
        .value;
    var email = document.getElementById("email")
        .value;
    var phone = document.getElementById("phone")
        .value;
    var education = document.getElementById("education").value;
    var skills = document.getElementById("skills").value.split(",");
    var experience = document.getElementById("experience").value;
    // Display user input in the resume
    displayName.textContent = name;
    displayEmail.textContent = email;
    displayPhone.textContent = phone;
    // Update Education section
    displayEducation.innerHTML = "";
    education.split("\n").forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        displayEducation.appendChild(li);
    });
    // Update Skills section
    displaySkills.innerHTML = "";
    skills.forEach(function (skill) {
        var li = document.createElement("li");
        li.textContent = skill.trim();
        displaySkills.appendChild(li);
    });
    // Update Work Experience section
    displayExperience.innerHTML = "";
    experience.split("\n").forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        displayExperience.appendChild(li);
    });
    // Handle Profile Image Upload
    if (profileImageInput.files && profileImageInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (e.target) {
                profilePic.src = e.target.result; // Set the uploaded image as profile picture
            }
        };
        reader.readAsDataURL(profileImageInput.files[0]); // Read the file as data URL
    }
    else {
        profilePic.src = "Default1.webp"; // Use a default image if none is uploaded
    }
    // Create a user data object
    var userData = {
        name: name,
        email: email,
        phone: phone,
        education: education.split("\n"),
        skills: skills,
        experience: experience.split("\n"),
        profileImage: profilePic.src,
    };
    // Save user data to local storage
    var uniqueUsername = name.toLowerCase().replace(/\s+/g, "-");
    localStorage.setItem(uniqueUsername, JSON.stringify(userData));
    // Call the function to generate the shareable link after the resume is generated
    generateShareableLink();
    // Show the resume and hide the form
    resumeContainer.style.display = "block";
    formContainer.style.display = "none";
}
// Function to generate a shareable link
function generateShareableLink() {
    var baseUrl = window.location.origin; // Get the base URL (e.g., https://yourdomain.vercel.app)
    // Get the current unique username or identifier
    var name = document.getElementById("name")
        .value;
    var uniqueUsername = name.toLowerCase().replace(/\s+/g, "-"); // Convert name to lowercase and replace spaces with hyphens
    // Manually set the path to point to the Profile page
    var profilePath = "/".concat(uniqueUsername, "/profile"); // This assumes your profile page follows this path
    // Combine base URL and path to create the shareable link
    var shareableLink = "".concat(baseUrl).concat(profilePath);
    // Update the inner HTML of the element with id 'generatedURL' to display the link
    var generatedURLElement = document.getElementById("generatedURL");
    if (generatedURLElement) {
        generatedURLElement.innerHTML = "Shareable Link: <a href=\"".concat(shareableLink, "\" target=\"_blank\">").concat(shareableLink, "</a>");
    }
}
// On page load, check if there is a unique identifier in the URL
document.addEventListener("DOMContentLoaded", function () {
    var path = window.location.pathname.split("/");
    if (path.length > 1 && path[1]) {
        var username = path[1]; // Assuming the unique path is the first segment after the domain
        // Retrieve user data from local storage or server
        var userData = localStorage.getItem(username); // Replace with server call if needed
        if (userData) {
            var data = JSON.parse(userData);
            populateResume(data); // Function to populate the resume with user data
        }
        else {
            console.error("No user data found for the provided URL.");
        }
    }
});
// Function to populate the resume with user data
function populateResume(data) {
    displayName.textContent = data.name;
    displayEmail.textContent = data.email;
    displayPhone.textContent = data.phone;
    displayEducation.innerHTML = "";
    data.education.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        displayEducation.appendChild(li);
    });
    displaySkills.innerHTML = "";
    data.skills.forEach(function (skill) {
        var li = document.createElement("li");
        li.textContent = skill;
        displaySkills.appendChild(li);
    });
    displayExperience.innerHTML = "";
    data.experience.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        displayExperience.appendChild(li);
    });
    // Set profile picture
    if (data.profileImage) {
        profilePic.src = data.profileImage;
    }
    else {
        profilePic.src = "Default1.webp";
    }
    // Show the resume and hide the form
    resumeContainer.style.display = "block";
    formContainer.style.display = "none";
}
// Copy Link functionality
copyLinkButton.addEventListener("click", function () {
    var urlToCopy = generatedURL.innerText.split(" ").pop() || ""; // Get the actual URL to copy
    navigator.clipboard.writeText(urlToCopy).then(function () {
        alert("Link copied to clipboard!"); // Alert the user that the link has been copied
    });
});
// PDF Download functionality
downloadPDFButton.addEventListener("click", function () {
    var element = document.getElementById("resume");
    var buttons = document.getElementById("share-download-options");
    if (element && buttons) {
        // Hide buttons temporarily while generating the PDF
        buttons.style.display = "none";
        // Configure the PDF options
        var opt = {
            margin: 1, // Margin in inches
            filename: "Resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 }, // Higher scale for better quality
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        // Generate PDF
        html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(function () {
            // Show buttons again after PDF is downloaded
            buttons.style.display = "block";
        })
            .catch(function () {
            // If there's an error, make sure buttons are shown again
            buttons.style.display = "block";
        });
    }
});
