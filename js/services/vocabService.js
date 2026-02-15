import { db } from "../firebase.js";
import { collection, getDocs } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function getVocab() {
  const snapshot = await getDocs(collection(db, "vocab"));
  return snapshot.docs.map(doc => doc.data());
}
