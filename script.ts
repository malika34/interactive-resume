// TypeScript code to add interactivity

// Get the toggle button and skills section
const toggleButton = document.getElementById(
  "toggle-skills"
) as HTMLButtonElement;
const skillsSection = document.getElementById("skills") as HTMLElement;

// Add event listener to the toggle button
toggleButton.addEventListener("click", () => {
  if (skillsSection.style.display === "none") {
    skillsSection.style.display = "block";
  } else {
    skillsSection.style.display = "none";
  }
});
