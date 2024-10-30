// reportCard.js

// Check if Firebase has been initialized
if (typeof firebase === 'undefined') {
  console.error("Firebase is not initialized.");
} else {
  const auth = firebase.auth();
  const db = firebase.firestore();

  document.addEventListener('DOMContentLoaded', async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("User not logged in");
      window.location.href = "index.html"; // Redirect to login
      return;
    }

    const userId = user.uid;
    const reportCardRef = db.collection("reportCards").doc(userId);

    try {
      const docSnap = await reportCardRef.get();

      if (docSnap.exists) {
        const data = docSnap.data();
        document.getElementById("user").textContent = `Name: ${data.name}`;
        const skillsList = document.getElementById("skills-list");

        for (const [skill, result] of Object.entries(data.skills)) {
          const skillItem = document.createElement("p");
          skillItem.textContent = `${skill}: ${result}`;
          skillsList.appendChild(skillItem);
        }

        // Show Edit button if the user is an admin
        if (data.isAdmin) {
          document.getElementById("edit-button").style.display = "block";
        }
      } else {
        console.log("No report card data found.");
      }
    } catch (error) {
      console.error("Error fetching report card:", error);
    }
  });

  // Edit button functionality for admins
  document.getElementById("edit-button").addEventListener("click", () => {
    const skillsList = document.getElementById("skills-list");

    // Toggle edit mode
    Array.from(skillsList.children).forEach(skillItem => {
      const [skill, result] = skillItem.textContent.split(": ");

      // Create input for editing
      const input = document.createElement("input");
      input.value = result.trim();
      input.dataset.skill = skill;

      skillItem.innerHTML = `${skill}: `;
      skillItem.appendChild(input);
    });

    // Change button text to Save
    document.getElementById("edit-button").textContent = "Save";
    document.getElementById("edit-button").onclick = saveEdits;
  });

  // Save changes made by admin
  async function saveEdits() {
    const skillsList = document.getElementById("skills-list");
    const updatedSkills = {};

    Array.from(skillsList.children).forEach(skillItem => {
      const input = skillItem.querySelector("input");
      if (input) {
        updatedSkills[input.dataset.skill] = input.value.trim();
      }
    });

    const userId = auth.currentUser.uid;
    const reportCardRef = db.collection("reportCards").doc(userId);

    try {
      await reportCardRef.update({ skills: updatedSkills });
      alert("Report card updated successfully!");
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error("Error updating report card:", error);
      alert("Failed to update report card.");
    }
  }
}
