// scripts/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD06Rb9IWFTSRa7yMPp1G2o-xBv08enrxU",
    authDomain: "baars-ec9db.firebaseapp.com",
    projectId: "baars-ec9db",
    storageBucket: "baars-ec9db.firebasestorage.app",
    messagingSenderId: "117385635405",
    appId: "1:117385635405:web:da9228caec59c76bfb1e04",
    measurementId: "G-YRSNJBBNP2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, addDoc, onSnapshot };