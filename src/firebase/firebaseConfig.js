import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
