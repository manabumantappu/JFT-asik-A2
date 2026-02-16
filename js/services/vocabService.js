import { db } from "../firebase.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Ambil semua vocab
export async function getVocab() {
  const snapshot = await getDocs(collection(db, "vocab"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Filter berdasarkan kategori
export async function getVocabByCategory(category) {
  const q = query(
    collection(db, "vocab"),
    where("kategori", "==", category)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
