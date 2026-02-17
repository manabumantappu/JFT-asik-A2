import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import { updateDoc, doc } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { db } from "../firebase.js";

export async function toggleDisable(uid, currentStatus) {

  await updateDoc(doc(db, "users", uid), {
    disabled: !currentStatus
  });

  alert("Status akun diperbarui");
  location.reload();
}

// Tambah soal
export async function addQuestion(data) {
  await addDoc(collection(db, "questions"), {
    question: data.question,
    options: data.options,
    answer: data.answer,
    explanation: data.explanation,
    type: data.type || "quiz",
    random: Math.random(), // penting untuk random query
    createdAt: serverTimestamp()
  });
}

// Hapus soal
export async function deleteQuestion(id) {
  await deleteDoc(doc(db, "questions", id));
}

// Update soal
export async function updateQuestion(id, data) {
  await updateDoc(doc(db, "questions", id), {
    ...data,
    random: Math.random()
  });
}
