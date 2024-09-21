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
var errorMessages = document.getElementById("errorMessages");
// Theme Change Logic
themeSelector.addEventListener("change", function () {
    var selectedTheme = themeSelector.value;
    document.body.className = "";
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
    resumeContainer.style.display = "none";
});
// Function to validate form inputs
function validateForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var education = document.getElementById("education").value;
    var skills = document.getElementById("skills").value;
    var experience = document.getElementById("experience").value;
    var errors = [];
    if (!name)
        errors.push("Name is required.");
    if (!email || email.indexOf("@") === -1)
        errors.push("A valid email is required.");
    if (!phone || isNaN(Number(phone)))
        errors.push("Phone must be a number.");
    if (!education)
        errors.push("Education is required.");
    if (!skills)
        errors.push("Skills are required.");
    if (!experience)
        errors.push("Experience is required.");
    errorMessages.innerHTML = errors.join("<br />");
    return errors.length === 0;
}
// Add event listener to the Generate Resume button
generateButton.addEventListener("click", function () {
    if (validateForm()) {
        loadingBar.style.display = "block";
        loadingBar.style.width = "0%";
        var width_1 = 0;
        var interval_1 = setInterval(function () {
            if (width_1 >= 100) {
                clearInterval(interval_1);
                loadingBar.style.display = "none";
                generateResume();
            }
            else {
                width_1 += 10;
                loadingBar.style.width = "".concat(width_1, "%");
            }
        }, 200);
    }
});
// Function to handle resume generation
function generateResume() {
    var name = document.getElementById("name")
        .value;
    var email = document.getElementById("email")
        .value;
    var phone = document.getElementById("phone")
        .value;
    var education = document.getElementById("education").value;
    var skills = document.getElementById("skills").value.split(",");
    var experience = document.getElementById("experience").value;
    displayName.textContent = name;
    displayEmail.textContent = email;
    displayPhone.textContent = phone;
    displayEducation.innerHTML = "";
    education.split("\n").forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        displayEducation.appendChild(li);
    });
    displaySkills.innerHTML = "";
    skills.forEach(function (skill) {
        var li = document.createElement("li");
        li.textContent = skill.trim();
        displaySkills.appendChild(li);
    });
    displayExperience.innerHTML = "";
    experience.split("\n").forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        displayExperience.appendChild(li);
    });
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
    var userData = {
        name: name,
        email: email,
        phone: phone,
        education: education.split("\n"),
        skills: skills,
        experience: experience.split("\n"),
        profileImage: profilePic.src,
    };
    var uniqueUsername = name.toLowerCase().replace(/\s+/g, "-");
    localStorage.setItem(uniqueUsername, JSON.stringify(userData));
    generateShareableLink();
    resumeContainer.style.display = "block";
    formContainer.style.display = "none";
}
// Function to generate a shareable link
function generateShareableLink() {
    var baseUrl = window.location.origin;
    var name = document.getElementById("name")
        .value;
    var uniqueUsername = name.toLowerCase().replace(/\s+/g, "-");
    var profilePath = "/".concat(uniqueUsername, "/profile");
    var shareableLink = "".concat(baseUrl).concat(profilePath);
    var generatedURLElement = document.getElementById("generatedURL");
    if (generatedURLElement) {
        generatedURLElement.innerHTML = "Shareable Link: <a href=\"".concat(shareableLink, "\" target=\"_blank\">").concat(shareableLink, "</a>");
    }
}
// On page load, check if there is a unique identifier in the URL
document.addEventListener("DOMContentLoaded", function () {
    var path = window.location.pathname.split("/");
    if (path.length > 1 && path[1]) {
        var username = path[1];
        var userData = localStorage.getItem(username);
        if (userData) {
            var data = JSON.parse(userData);
            populateResume(data);
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
        li.textContent = skill.trim();
        displaySkills.appendChild(li);
    });
    displayExperience.innerHTML = "";
    data.experience.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        displayExperience.appendChild(li);
    });
    profilePic.src = data.profileImage || "Default1.webp";
}
// Add event listener for copy link button
copyLinkButton.addEventListener("click", function () {
    var shareableLink = generatedURL.innerText;
    navigator.clipboard
        .writeText(shareableLink)
        .then(function () {
        alert("Link copied to clipboard!");
    })
        .catch(function (err) {
        console.error("Failed to copy: ", err);
    });
});
// Add event listener for download PDF button
downloadPDFButton.addEventListener("click", function () {
    var element = document.getElementById("resume");
    var buttons = document.getElementById("share-download-options");
    if (element && buttons) {
        buttons.style.display = "none";
        var opt = {
            margin: 0.5,
            filename: "Resume.pdf",
            image: { type: "jpeg", quality: 0.95 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: "in",
                format: "a4",
                orientation: "portrait",
                autoPaging: "text",
            },
        };
        html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(function () {
            buttons.style.display = "block";
        })
            .catch(function () {
            buttons.style.display = "block";
        });
    }
});
