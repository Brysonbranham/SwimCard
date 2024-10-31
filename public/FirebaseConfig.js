import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD01IWz-f7El4NMXH66x6_yeqErb1hs68A",
    authDomain: "swimlesson1-a6b62.firebaseapp.com",
    projectId: "swimlesson1-a6b62",
    storageBucket: "swimlesson1-a6b62.appspot.com",
    messagingSenderId: "559608954358",
    appId: "1:559608954358:web:e9cb94778395a7de9f9bd7",
    measurementId: "G-C98VGSQ97N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

