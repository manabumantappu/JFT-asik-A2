import { auth } from "./firebase.js";
import { db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ================= REGISTER =================
window.registerUser = async () => {
  try {
    const email = emailInput.value;
    const pass = passwordInput.value;

    const userCredential =
      await createUserWithEmailAndPassword(auth, email, pass);

    // 🔥 WAJIB ADA INI
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      role: "user",
      disabled: false,
      createdAt: serverTimestamp()
    });

    alert("Berhasil daftar!");
    location.href = "index.html";

  } catch (error) {
    alert(error.message);
  }
};


// ================= LOGIN =================
window.loginUser = async () => {
  try {
    const email = emailInput.value;
    const pass = passwordInput.value;

    await signInWithEmailAndPassword(auth, email, pass);
    location.href = "index.html";

  } catch (error) {
    alert(error.message);
  }
};


// ================= LOGOUT =================
window.logoutUser = async () => {
  await signOut(auth);
  location.href = "login.html";
};
