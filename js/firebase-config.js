import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, setDoc, deleteDoc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSKQMPm03uN4YUgzm7XLIABtlJx5CY9wU",
  authDomain: "cosmic-store-29d4b.firebaseapp.com",
  projectId: "cosmic-store-29d4b",
  storageBucket: "cosmic-store-29d4b.firebasestorage.app",
  messagingSenderId: "209258286765",
  appId: "1:209258286765:web:eec0d3e86ec135e78fc024",
  measurementId: "G-KY8Y51NL3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Expose Firebase functions globally so your existing scripts (like admin.js) can use them without breaking
window.firebaseDb = db;
window.firebaseDoc = doc;
window.firebaseSetDoc = setDoc;
window.firebaseDeleteDoc = deleteDoc;
window.firebaseGetDoc = getDoc;
window.firebaseGetDocs = getDocs;
window.firebaseCollection = collection;
