import { db, auth } from "../services/../firebase.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const progressBox = document.getElementById("progressBox");

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    progressBox.innerHTML = "Harus login.";
    return;
  }

  const progressRef = doc(db, "progress", user.uid);
  const snap = await getDoc(progressRef);

  if (!snap.exists()) {
    progressBox.innerHTML = `
      <p class="text-gray-500">
        Belum ada data quiz.
      </p>
    `;
    return;
  }

  const data = snap.data();

  const percent = Math.round(
    (data.bestScore / 10) * 100
  );

  progressBox.innerHTML = `
    <div class="space-y-4">

      <div>
        <div class="text-sm text-gray-500">Best Score</div>
        <div class="text-2xl font-bold text-green-600">
          ${data.bestScore} / 10
        </div>
      </div>

      <div>
        <div class="text-sm text-gray-500">Last Score</div>
        <div class="text-xl font-semibold">
          ${data.lastScore} / 10
        </div>
      </div>

      <div>
        <div class="text-sm text-gray-500">Total Quiz</div>
        <div class="text-xl font-semibold">
          ${data.totalQuiz}
        </div>
      </div>

      <div>
        <div class="text-sm text-gray-500 mb-1">
          Persentase Terbaik
        </div>

        <div class="w-full bg-gray-200 rounded h-4">
          <div 
            class="bg-blue-600 h-4 rounded"
            style="width:${percent}%">
          </div>
        </div>

        <div class="text-right text-sm mt-1">
          ${percent}%
        </div>
      </div>

    </div>
  `;
});
