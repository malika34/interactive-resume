// Get elements from the DOM
const formContainer = document.getElementById(
  "formContainer"
) as HTMLDivElement;
const showFormButton = document.getElementById("showForm") as HTMLButtonElement;
const form = document.getElementById("resumeForm") as HTMLFormElement;
const generateButton = document.getElementById(
  "generateResume"
) as HTMLButtonElement;
const resumeContainer = document.getElementById("resume") as HTMLDivElement;
const displayName = document.getElementById(
  "display-name"
) as HTMLHeadingElement;
const displayEmail = document.getElementById(
  "display-email"
) as HTMLSpanElement;
const displayPhone = document.getElementById(
  "display-phone"
) as HTMLSpanElement;
const displayEducation = document.getElementById(
  "display-education"
) as HTMLUListElement;
const displaySkills = document.getElementById(
  "display-skills"
) as HTMLUListElement;
const displayExperience = document.getElementById(
  "display-experience"
) as HTMLUListElement;
const profilePic = document.getElementById("profile-pic") as HTMLImageElement;
const profileImageInput = document.getElementById(
  "profileImage"
) as HTMLInputElement;

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
showFormButton.addEventListener("click", () => {
  formContainer.style.display = "block";
  showFormButton.style.display = "none";
  resumeContainer.style.display = "none"; // Hide the resume while filling form
});

// Add event listener to the Generate Resume button
generateButton.addEventListener("click", () => {
  // Get user input values
  const name = (document.getElementById("name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const phone = (document.getElementById("phone") as HTMLInputElement).value;
  const education = (
    document.getElementById("education") as HTMLTextAreaElement
  ).value;
  const skills = (
    document.getElementById("skills") as HTMLInputElement
  ).value.split(",");
  const experience = (
    document.getElementById("experience") as HTMLTextAreaElement
  ).value;

  // Display user input in the resume
  displayName.textContent = name;
  displayEmail.textContent = email;
  displayPhone.textContent = phone;

  // Update Education
  displayEducation.innerHTML = "";
  education.split("\n").forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    displayEducation.appendChild(li);
  });

  // Update Skills
  displaySkills.innerHTML = "";
  skills.forEach((skill) => {
    const li = document.createElement("li");
    li.textContent = skill.trim();
    displaySkills.appendChild(li);
  });

  // Update Work Experience
  displayExperience.innerHTML = "";
  experience.split("\n").forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    displayExperience.appendChild(li);
  });

  // Handle Profile Image Upload
  if (profileImageInput.files && profileImageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target) {
        profilePic.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(profileImageInput.files[0]);
  } else {
    profilePic.src = "Default1.webp";
  }
  resumeContainer.style.display = "block";
  formContainer.style.display = "none";
});

// Optional: Save changes immediately to the local storage or apply directly
document.querySelectorAll("[contenteditable]").forEach((element) => {
  element.addEventListener("input", () => {
    // Logic to handle save changes or update values in real-time
  });
});
