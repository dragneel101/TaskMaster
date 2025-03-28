// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace with your actual Firebase project config (from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyA2wVCUOMjaZ6-XDnu_Dv1sbJBOrrQDdwY",
    authDomain: "taskmaster-2a195.firebaseapp.com",
    projectId: "taskmaster-2a195",
    storageBucket: "taskmaster-2a195.firebasestorage.app",
    messagingSenderId: "885284738794",
    appId: "1:885284738794:web:ada86b02250f9a43e76993",
    measurementId: "G-HZHNV2J241"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
const db = getFirestore(app);
export { db };
