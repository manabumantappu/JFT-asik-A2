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

  const ref = doc(db, "progress", user.uid);
  const snap = await getDoc(ref);

  const today = new Date().toDateString();
  const xpEarned = score * 10;

  if (!snap.exists()) {

    await setDoc(ref, {
      bestScore: score,
      lastScore: score,
      totalQuiz: 1,
      xp: xpEarned,
      streak: 1,
      lastPlayed: today,
      updatedAt: serverTimestamp()
    });

    return;
  }

  const data = snap.data();

  let streak = 1;

  if (data.lastPlayed === today) {
    streak = data.streak;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (data.lastPlayed === yesterday.toDateString()) {
      streak = data.streak + 1;
    }
  }

  await updateDoc(ref, {
    lastScore: score,
    bestScore: Math.max(score, data.bestScore),
    totalQuiz: data.totalQuiz + 1,
    xp: (data.xp || 0) + xpEarned,
    streak: streak,
    lastPlayed: today,
    updatedAt: serverTimestamp()
  });
}
