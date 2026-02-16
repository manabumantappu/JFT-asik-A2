import { db, auth } from "../firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

export async function updateProgress(score) {

  const uid = auth.currentUser.uid;
  const progressRef = doc(db, "progress", uid);
  const snap = await getDoc(progressRef);

  if (!snap.exists()) {

    await setDoc(progressRef, {
      lastScore: score,
      totalQuiz: 1,
      bestScore: score,
      updatedAt: serverTimestamp()
    });

  } else {

    const data = snap.data();

    await updateDoc(progressRef, {
      lastScore: score,
      totalQuiz: (data.totalQuiz || 0) + 1,
      bestScore: Math.max(data.bestScore || 0, score),
      updatedAt: serverTimestamp()
    });
  }
}

// Ambil data progress
export async function getProgress() {
  const uid = auth.currentUser.uid;
  const snap = await getDoc(doc(db, "progress", uid));

  if (snap.exists()) {
    return snap.data();
  }

  return null;
}
