// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxSyEVPruab58DLBTEgHo258bHf6h2bc8",
  authDomain: "test-firebase-58537.firebaseapp.com",
  projectId: "test-firebase-58537",
  storageBucket: "test-firebase-58537.firebasestorage.app",
  messagingSenderId: "263583563546",
  appId: "1:263583563546:web:c4c2f5e665f6b03d9f36a3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);