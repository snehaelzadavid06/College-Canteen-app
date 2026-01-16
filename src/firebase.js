// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Replace with your actual config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyB00la1QxFerkv-NfcwCIqCG_iugvv5KLU",
    authDomain: "college-canteen-f6b4b.firebaseapp.com",
    projectId: "college-canteen-f6b4b",
    storageBucket: "college-canteen-f6b4b.firebasestorage.app",
    messagingSenderId: "1069501228066",
    appId: "1:1069501228066:web:9aeaa8df372fdcae6dd67b",
    measurementId: "G-TD9MLNN9L5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);