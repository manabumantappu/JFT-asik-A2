import { db, auth } from "../firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Email yang otomatis jadi admin
const ADMIN_EMAILS = [
  "azishachigo@gmail.com"  // pastikan ini email login kamu
];

export async function getUserRole() {

  const user = auth.currentUser;
  if (!user) return "user";

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  // Jika belum ada document → buat otomatis
  if (!snap.exists()) {

    const role = ADMIN_EMAILS.includes(user.email)
      ? "admin"
      : "user";

    await setDoc(userRef, {
      email: user.email,
      role: role,
      createdAt: serverTimestamp()
    });

    return role;
  }

  return snap.data().role;
}
