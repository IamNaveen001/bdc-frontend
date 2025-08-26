// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAjafKd6l-BUARmDDbni8sGjh-gTW4G3bk",
  authDomain: "blood-donate-2026.firebaseapp.com",
  projectId: "blood-donate-2026",
  storageBucket: "blood-donate-2026.firebasestorage.app",
  messagingSenderId: "463910347679",
  appId: "1:463910347679:web:1da81096b4a02a73b9d3aa",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
