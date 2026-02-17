import { auth } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
   window.location.href = "login.html";
  }
});
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { db, auth } from "./firebase.js";
import { signOut } from
"https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));

  if (snap.exists()) {
    const data = snap.data();

    if (data.disabled === true) {
      alert("Akun Anda dinonaktifkan oleh Admin.");
      await signOut(auth);
      window.location.href = "login.html";
    }
  }

});
