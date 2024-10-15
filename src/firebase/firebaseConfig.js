// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxsxQQxz160SY60DQnFs9GOPL7941zStY",
  authDomain: "motionsync-551e0.firebaseapp.com",
  projectId: "motionsync-551e0",
  storageBucket: "motionsync-551e0.appspot.com",
  messagingSenderId: "399969005893",
  appId: "1:399969005893:web:1240febf596953745c0e2c",
  measurementId: "G-6GK37BG27V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export { db }; // Export Firestore instance
