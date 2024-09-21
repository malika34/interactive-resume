// Inform TypeScript about the external library
declare var html2pdf: any;

// Get elements from the DOM
const formContainer = document.getElementById(
  "formContainer"
) as HTMLDivElement;
const showFormButton = document.getElementById("showForm") as HTMLButtonElement;
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
const copyLinkButton = document.getElementById("copyLink") as HTMLButtonElement;
const downloadPDFButton = document.getElementById(
  "downloadPDF"
) as HTMLButtonElement;
const generatedURL = document.getElementById(
  "generatedURL"
) as HTMLParagraphElement;
const themeSelector = document.getElementById("theme") as HTMLSelectElement;
const loadingBar = document.getElementById("loadingBar") as HTMLDivElement;
const errorMessages = document.getElementById(
  "errorMessages"
) as HTMLDivElement;

// Theme Change Logic
themeSelector.addEventListener("change", () => {
  const selectedTheme: string = themeSelector.value;
  document.body.className = "";
  if (selectedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else if (selectedTheme === "light") {
    document.body.classList.add("light-mode");
  }
});

// Show form when the button is clicked
showFormButton.addEventListener("click", () => {
  formContainer.style.display = "block";
  showFormButton.style.display = "none";
  resumeContainer.style.display = "none";
});

// Function to validate form inputs
function validateForm(): boolean {
  const name = (document.getElementById("name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const phone = (document.getElementById("phone") as HTMLInputElement).value;
  const education = (
    document.getElementById("education") as HTMLTextAreaElement
  ).value;
  const skills = (document.getElementById("skills") as HTMLInputElement).value;
  const experience = (
    document.getElementById("experience") as HTMLTextAreaElement
  ).value;

  let errors: string[] = [];

  if (!name) errors.push("Name is required.");
  if (!email || email.indexOf("@") === -1)
    errors.push("A valid email is required.");
  if (!phone || isNaN(Number(phone))) errors.push("Phone must be a number.");
  if (!education) errors.push("Education is required.");
  if (!skills) errors.push("Skills are required.");
  if (!experience) errors.push("Experience is required.");

  errorMessages.innerHTML = errors.join("<br />");

  return errors.length === 0;
}

// Add event listener to the Generate Resume button
generateButton.addEventListener("click", () => {
  if (validateForm()) {
    loadingBar.style.display = "block";
    loadingBar.style.width = "0%";

    let width: number = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        loadingBar.style.display = "none";
        generateResume();
      } else {
        width += 10;
        loadingBar.style.width = `${width}%`;
      }
    }, 200);
  }
});

// Function to handle resume generation
function generateResume(): void {
  const name: string = (document.getElementById("name") as HTMLInputElement)
    .value;
  const email: string = (document.getElementById("email") as HTMLInputElement)
    .value;
  const phone: string = (document.getElementById("phone") as HTMLInputElement)
    .value;
  const education: string = (
    document.getElementById("education") as HTMLTextAreaElement
  ).value;
  const skills: string[] = (
    document.getElementById("skills") as HTMLInputElement
  ).value.split(",");
  const experience: string = (
    document.getElementById("experience") as HTMLTextAreaElement
  ).value;

  displayName.textContent = name;
  displayEmail.textContent = email;
  displayPhone.textContent = phone;

  displayEducation.innerHTML = "";
  education.split("\n").forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    displayEducation.appendChild(li);
  });

  displaySkills.innerHTML = "";
  skills.forEach((skill) => {
    const li = document.createElement("li");
    li.textContent = skill.trim();
    displaySkills.appendChild(li);
  });

  displayExperience.innerHTML = "";
  experience.split("\n").forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    displayExperience.appendChild(li);
  });

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

  const userData = {
    name: name,
    email: email,
    phone: phone,
    education: education.split("\n"),
    skills: skills,
    experience: experience.split("\n"),
    profileImage: profilePic.src,
  };

  const uniqueUsername = name.toLowerCase().replace(/\s+/g, "-");
  localStorage.setItem(uniqueUsername, JSON.stringify(userData));

  generateShareableLink();

  resumeContainer.style.display = "block";
  formContainer.style.display = "none";
}

// Function to generate a shareable link
function generateShareableLink(): void {
  const baseUrl: string = window.location.origin;

  const name: string = (document.getElementById("name") as HTMLInputElement)
    .value;
  const uniqueUsername: string = name.toLowerCase().replace(/\s+/g, "-");

  const profilePath: string = `/${uniqueUsername}/profile`;

  const shareableLink: string = `${baseUrl}${profilePath}`;

  const generatedURLElement = document.getElementById(
    "generatedURL"
  ) as HTMLParagraphElement;
  if (generatedURLElement) {
    generatedURLElement.innerHTML = `Shareable Link: <a href="${shareableLink}" target="_blank">${shareableLink}</a>`;
  }
}

// On page load, check if there is a unique identifier in the URL
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname.split("/");
  if (path.length > 1 && path[1]) {
    const username = path[1];

    const userData = localStorage.getItem(username);

    if (userData) {
      const data = JSON.parse(userData);
      populateResume(data);
    } else {
      console.error("No user data found for the provided URL.");
    }
  }
});

// Function to populate the resume with user data
function populateResume(data: any): void {
  displayName.textContent = data.name;
  displayEmail.textContent = data.email;
  displayPhone.textContent = data.phone;

  displayEducation.innerHTML = "";
  data.education.forEach((item: string) => {
    const li = document.createElement("li");
    li.textContent = item;
    displayEducation.appendChild(li);
  });

  displaySkills.innerHTML = "";
  data.skills.forEach((skill: string) => {
    const li = document.createElement("li");
    li.textContent = skill.trim();
    displaySkills.appendChild(li);
  });

  displayExperience.innerHTML = "";
  data.experience.forEach((item: string) => {
    const li = document.createElement("li");
    li.textContent = item;
    displayExperience.appendChild(li);
  });

  profilePic.src = data.profileImage || "Default1.webp";
}

// Add event listener for copy link button
copyLinkButton.addEventListener("click", () => {
  const shareableLink = generatedURL.innerText;
  navigator.clipboard
    .writeText(shareableLink)
    .then(() => {
      alert("Link copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
});

// Add event listener for download PDF button
downloadPDFButton.addEventListener("click", () => {
  const element = document.getElementById("resume") as HTMLDivElement;
  const buttons = document.getElementById(
    "share-download-options"
  ) as HTMLDivElement;

  if (element && buttons) {
    buttons.style.display = "none";

    const opt = {
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
      .then(() => {
        buttons.style.display = "block";
      })
      .catch(() => {
        buttons.style.display = "block";
      });
  }
});
