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

// Theme Change Logic
themeSelector.addEventListener("change", () => {
  const selectedTheme: string = themeSelector.value;
  document.body.className = ""; // Reset any previous theme
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
  resumeContainer.style.display = "none"; // Hide the resume while filling form
});

// Add event listener to the Generate Resume button
generateButton.addEventListener("click", () => {
  // Show loading bar
  loadingBar.style.display = "block";
  loadingBar.style.width = "0%";

  // Simulate form processing
  let width: number = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      loadingBar.style.display = "none"; // Hide the loading bar after completion

      // Proceed with resume generation logic
      generateResume();
    } else {
      width += 10; // Increase width by 10% increments
      loadingBar.style.width = `${width}%`;
    }
  }, 200);
});

// Function to handle resume generation
function generateResume(): void {
  // Get user input values
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

  // Display user input in the resume
  displayName.textContent = name;
  displayEmail.textContent = email;
  displayPhone.textContent = phone;

  // Update Education section
  displayEducation.innerHTML = "";
  education.split("\n").forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    displayEducation.appendChild(li);
  });

  // Update Skills section
  displaySkills.innerHTML = "";
  skills.forEach((skill) => {
    const li = document.createElement("li");
    li.textContent = skill.trim();
    displaySkills.appendChild(li);
  });

  // Update Work Experience section
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
        profilePic.src = e.target.result as string; // Set the uploaded image as profile picture
      }
    };
    reader.readAsDataURL(profileImageInput.files[0]); // Read the file as data URL
  } else {
    profilePic.src = "Default1.webp"; // Use a default image if none is uploaded
  }

  // Create a user data object
  const userData = {
    name: name,
    email: email,
    phone: phone,
    education: education.split("\n"),
    skills: skills,
    experience: experience.split("\n"),
    profileImage: profilePic.src,
  };

  // Save user data to local storage
  const uniqueUsername = name.toLowerCase().replace(/\s+/g, "-");
  localStorage.setItem(uniqueUsername, JSON.stringify(userData));

  // Call the function to generate the shareable link after the resume is generated
  generateShareableLink();

  // Show the resume and hide the form
  resumeContainer.style.display = "block";
  formContainer.style.display = "none";
}

// Function to generate a shareable link
function generateShareableLink(): void {
  const baseUrl: string = window.location.origin; // Get the base URL (e.g., https://yourdomain.vercel.app)

  // Get the current unique username or identifier
  const name: string = (document.getElementById("name") as HTMLInputElement)
    .value;
  const uniqueUsername: string = name.toLowerCase().replace(/\s+/g, "-"); // Convert name to lowercase and replace spaces with hyphens

  // Manually set the path to point to the Profile page
  const profilePath: string = `/${uniqueUsername}/profile`; // This assumes your profile page follows this path

  // Combine base URL and path to create the shareable link
  const shareableLink: string = `${baseUrl}${profilePath}`;

  // Update the inner HTML of the element with id 'generatedURL' to display the link
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
    const username = path[1]; // Assuming the unique path is the first segment after the domain

    // Retrieve user data from local storage or server
    const userData = localStorage.getItem(username); // Replace with server call if needed

    if (userData) {
      const data = JSON.parse(userData);
      populateResume(data); // Function to populate the resume with user data
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
    li.textContent = skill;
    displaySkills.appendChild(li);
  });

  displayExperience.innerHTML = "";
  data.experience.forEach((item: string) => {
    const li = document.createElement("li");
    li.textContent = item;
    displayExperience.appendChild(li);
  });

  // Set profile picture
  if (data.profileImage) {
    profilePic.src = data.profileImage;
  } else {
    profilePic.src = "Default1.webp";
  }

  // Show the resume and hide the form
  resumeContainer.style.display = "block";
  formContainer.style.display = "none";
}

// Copy Link functionality
copyLinkButton.addEventListener("click", () => {
  const urlToCopy: string = generatedURL.innerText.split(" ").pop() || ""; // Get the actual URL to copy
  navigator.clipboard.writeText(urlToCopy).then(() => {
    alert("Link copied to clipboard!"); // Alert the user that the link has been copied
  });
});

// PDF Download functionality
downloadPDFButton.addEventListener("click", () => {
  const element = document.getElementById("resume") as HTMLDivElement;
  const buttons = document.getElementById(
    "share-download-options"
  ) as HTMLDivElement;

  if (element && buttons) {
    // Hide buttons temporarily while generating the PDF
    buttons.style.display = "none";

    // Configure the PDF options
    const opt = {
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
      .then(() => {
        // Show buttons again after PDF is downloaded
        buttons.style.display = "block";
      })
      .catch(() => {
        // If there's an error, make sure buttons are shown again
        buttons.style.display = "block";
      });
  }
});
