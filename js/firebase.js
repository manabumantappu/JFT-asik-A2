// js/firebase.js

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { getAuth } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { getFirestore } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLKv-oOkCSrpCWUYL91zzjxlPFpV1H5U4",
  authDomain: "jft-asik-a2.firebaseapp.com",
  projectId: "jft-asik-a2",
  storageBucket: "jft-asik-a2.firebasestorage.app",
  messagingSenderId: "556612903099",
  appId: "1:556612903099:web:a696aabd84a127b73b099e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export supaya bisa dipakai di file lain
export const auth = getAuth(app);
export const db = getFirestore(app);
