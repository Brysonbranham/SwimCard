// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);