import { auth, db } from '/FirebaseConfig.js';
import { getDoc, doc, updateDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Check if the user is logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid;
    loadUserData(uid);
  } else {
    window.location.href = 'Frontpage.html'; // Redirect to login page
  }
});

// Load user data from Firestore
async function loadUserData(uid) {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      document.getElementById('user').textContent = userData.name;

      // Check if the user is an admin
      const isAdmin = userData.role === 'admin'; // Assuming 'role' field exists

      if (isAdmin) {
        await loadStudentSelector(); // Load students in dropdown
      } else {
        // Load the skills for the logged-in user
        displaySkills(userData.skills, isAdmin);
      }
    } else {
      console.error("No such user document!");
    }
  } catch (error) {
    console.error("Error getting user document:", error);
  }
}

// Function to load students into the dropdown
async function loadStudentSelector() {
  const studentsCollectionRef = collection(db, 'users'); // Collection where students are stored
  const studentsSnapshot = await getDocs(studentsCollectionRef);
  
  const studentSelector = document.getElementById('student-selector');
  
  studentsSnapshot.forEach(doc => {
    const studentData = doc.data();
    if (studentData.role === 'student') { // Assuming students have a role of 'student'
      const option = document.createElement('option');
      option.value = doc.id; // Document ID (UID)
      option.textContent = studentData.name; // Student's name
      studentSelector.appendChild(option);
    }
  });

  // Add event listener for student selection
  studentSelector.addEventListener('change', async (event) => {
    const selectedStudentId = event.target.value;
    await loadStudentData(selectedStudentId); // Load selected student's data
  });
}

// Load selected student's data
async function loadStudentData(studentId) {
  try {
    const studentDocRef = doc(db, 'users', studentId);
    const studentDocSnap = await getDoc(studentDocRef);

    if (studentDocSnap.exists()) {
      const studentData = studentDocSnap.data();
      displaySkills(studentData.skills, true, studentId); // Pass true for admin view
    } else {
      console.error("No such student document!");
    }
  } catch (error) {
    console.error("Error getting student document:", error);
  }
}

// Function to display skills in a table
function displaySkills(skills, isAdmin, studentId) {
  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = ''; // Clear previous skills

  for (const [skillName, status] of Object.entries(skills)) {
    const row = document.createElement('tr');
    
    // Create Skill Name Cell
    const skillCell = document.createElement('td');
    skillCell.textContent = skillName;
    row.appendChild(skillCell);
    
    // Create Status Cell with clickable box
    const statusCell = document.createElement('td');
    const statusBox = document.createElement('div');
    statusBox.className = 'status-box';
    statusBox.textContent = (status === "Passed") ? '✔️' : '✖️'; // Show checkmark or cross

    // Change background color based on status
    statusBox.style.backgroundColor = (status === "Passed") ? '#dff0d8' : '#f2dede'; // Light green or light red

    // Allow editing only if the user is an admin
    if (isAdmin) {
      statusBox.style.cursor = 'pointer'; // Change cursor to pointer
      statusBox.addEventListener('click', async () => {
        const newStatus = (statusBox.textContent === '✔️') ? "Not Passed" : "Passed"; // Toggle status
        statusBox.textContent = (newStatus === "Passed") ? '✔️' : '✖️';
        statusBox.style.backgroundColor = (newStatus === "Passed") ? '#dff0d8' : '#f2dede'; // Update color

        await updateSkillStatus(skillName, newStatus, studentId); // Update Firestore immediately
      });
    } else {
      statusBox.style.cursor = 'not-allowed'; // Change cursor if not admin
      statusBox.title = "You do not have permission to edit this skill"; // Tooltip for feedback
    }

    statusCell.appendChild(statusBox);
    row.appendChild(statusCell);
    
    skillsList.appendChild(row);
  }
}

// Function to update skill status in Firestore
async function updateSkillStatus(skillName, newStatus, studentId) {
  try {
    const userDocRef = doc(db, 'users', studentId); // Reference to the selected student's document
    await updateDoc(userDocRef, {
      [`skills.${skillName}`]: newStatus // Use dot notation to update nested fields
    });
    console.log("Skill updated successfully in Firestore."); // Log success message
  } catch (error) {
    console.error("Error updating skill status:", error);
  }
}
