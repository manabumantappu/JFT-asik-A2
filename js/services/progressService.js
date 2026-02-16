import { db, auth } from "../firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

export async function saveQuizResult(score, total) {

  const user = auth.currentUser;
  if (!user) return;

  const progressRef = doc(db, "progress", user.uid);
  const snap = await getDoc(progressRef);

  if (!snap.exists()) {

    await setDoc(progressRef, {
      bestScore: score,
      lastScore: score,
      totalQuiz: 1,
      updatedAt: serverTimestamp()
    });

    return;
  }

  const data = snap.data();

  await updateDoc(progressRef, {
    lastScore: score,
    bestScore: Math.max(score, data.bestScore),
    totalQuiz: data.totalQuiz + 1,
    updatedAt: serverTimestamp()
  });
}
