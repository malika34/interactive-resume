// Get elements from the DOM
var formContainer = document.getElementById("formContainer");
var showFormButton = document.getElementById("showForm");
var form = document.getElementById("resumeForm");
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
// Initialize dashboard state:
resumeContainer.style.display = "block";
profilePic.src = "Default1.webp";
displayName.textContent = "";
displayEmail.textContent = "";
displayPhone.textContent = "";
displayEducation.innerHTML = "";
displaySkills.innerHTML = "";
displayExperience.innerHTML = "";
// Show form when the button is clicked
showFormButton.addEventListener("click", function () {
    formContainer.style.display = "block";
    showFormButton.style.display = "none";
    resumeContainer.style.display = "none"; // Hide the resume while filling form
});
// Add event listener to the Generate Resume button
generateButton.addEventListener("click", function () {
    // Get user input values
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var education = document.getElementById("education").value;
    var skills = document.getElementById("skills").value.split(",");
    var experience = document.getElementById("experience").value;
    // Display user input in the resume
    displayName.textContent = name;
    displayEmail.textContent = email;
    displayPhone.textContent = phone;
    // Update Education
    displayEducation.innerHTML = "";
    education.split("\n").forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        displayEducation.appendChild(li);
    });
    // Update Skills
    displaySkills.innerHTML = "";
    skills.forEach(function (skill) {
        var li = document.createElement("li");
        li.textContent = skill.trim();
        displaySkills.appendChild(li);
    });
    // Update Work Experience
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
                profilePic.src = e.target.result;
            }
        };
        reader.readAsDataURL(profileImageInput.files[0]);
    }
    else {
        profilePic.src = "Default1.webp";
    }
    resumeContainer.style.display = "block";
    formContainer.style.display = "none";
});
// Optional: Save changes immediately to the local storage or apply directly
document.querySelectorAll("[contenteditable]").forEach(function (element) {
    element.addEventListener("input", function () {
        // Logic to handle save changes or update values in real-time
    });
});
