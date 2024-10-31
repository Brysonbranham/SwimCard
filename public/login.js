import { auth, db } from '/FirebaseConfig.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js"; // Use the latest version

// Login function
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); 

  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Logged in:", user.email);
      // Redirect to the report card page
      window.location.href = 'reportCard.html'; 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error logging in:", errorCode, errorMessage);
      alert("Login failed: " + errorMessage);
    });
});
