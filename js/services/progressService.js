import { db, auth } from "../firebase.js";
import { doc, setDoc, serverTimestamp } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function saveProgress(score) {
  const uid = auth.currentUser.uid;
  await setDoc(doc(db, "progress", uid), {
    lastScore: score,
    updatedAt: serverTimestamp()
  });
}
