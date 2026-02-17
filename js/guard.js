import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import { db } from "./firebase.js";


onAuthStateChanged(auth, async (user) => {

  // 🔐 Belum login
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      const data = snap.data();

      // 🚫 Jika akun di-disable
      if (data.disabled === true) {
        alert("Akun Anda dinonaktifkan oleh Admin.");
        await signOut(auth);
        window.location.href = "login.html";
      }
    }

  } catch (error) {
    console.error("Guard error:", error);
  }

});
