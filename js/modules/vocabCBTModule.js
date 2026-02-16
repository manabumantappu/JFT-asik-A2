import { db } from "../firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

export async function initVocabCBT(config) {

  const { duration, totalQuestions } = config;

  const examBox = document.getElementById("examBox");
  const timerEl = document.getElementById("timer");
  const timeBar = document.getElementById("timeBar");

  let timeLeft = duration;
  let timerInterval;
  let currentIndex = 0;

  // ================= FETCH DATA =================
  const snapshot = await getDocs(collection(db, "vocab"));
  const allData = snapshot.docs.map(doc => doc.data());

  const questions = shuffle(allData)
    .slice(0, totalQuestions)
    .map(q => ({
      ...q,
      userAnswer: null
    }));

  // ================= TIMER =================
  function startTimer() {

    updateTimer();

    timerInterval = setInterval(() => {

      timeLeft--;
      updateTimer();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        finishExam();
      }

    }, 1000);
  }

  function updateTimer() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerEl.textContent =
      String(minutes).padStart(2,'0') +
      ":" +
      String(seconds).padStart(2,'0');

    const percent = (timeLeft / duration) * 100;
    timeBar.style.width = percent + "%";

    if (timeLeft <= 60) {
      timeBar.classList.add("bg-red-500");
    }
  }

  // ================= RENDER =================
  function renderQuestion() {

    const q = questions[currentIndex];

    const choices = shuffle([
      q.arti,
      ...shuffle(allData.filter(d => d.arti !== q.arti))
        .slice(0, 3)
        .map(d => d.arti)
    ]);

    examBox.innerHTML = `
      <div class="flex justify-between mb-4 text-sm text-gray-500">
        <div>Soal ${currentIndex + 1} / ${totalQuestions}</div>
      </div>

      <div class="text-center py-6">
        <div class="text-3xl font-bold text-blue-700">
          ${q.kanji}
        </div>
        <div class="text-gray-500 mt-2">
          (${q.romaji})
        </div>
      </div>

      <div class="space-y-3">
        ${choices.map(opt => `
          <button
            class="choice w-full min-h-[50px] py-3 rounded-xl
                   border border-gray-300
                   hover:bg-blue-100 transition"
            data-value="${opt}">
            ${opt}
          </button>
        `).join("")}
      </div>

      <div class="flex justify-between mt-6">
        <button id="prevBtn"
          class="px-4 py-2 bg-gray-300 rounded-xl">
          Prev
        </button>

        <button id="nextBtn"
          class="px-4 py-2 bg-blue-600 text-white rounded-xl">
          Next
        </button>
      </div>

      <button id="submitBtn"
        class="mt-4 w-full bg-green-600 text-white py-3 rounded-xl">
        Submit Exam
      </button>
    `;

    document.querySelectorAll(".choice").forEach(btn => {

      btn.onclick = () => {

        document.querySelectorAll(".choice").forEach(b =>
          b.classList.remove("bg-blue-200","border-blue-600")
        );

        btn.classList.add("bg-blue-200","border-blue-600");

        q.userAnswer = btn.dataset.value;
      };

      if (q.userAnswer === btn.dataset.value) {
        btn.classList.add("bg-blue-200","border-blue-600");
      }
    });

    document.getElementById("prevBtn").onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
      }
    };

    document.getElementById("nextBtn").onclick = () => {
      if (currentIndex < totalQuestions - 1) {
        currentIndex++;
        renderQuestion();
      }
    };

    document.getElementById("submitBtn").onclick = finishExam;
  }

  // ================= FINISH =================
  function finishExam() {

    clearInterval(timerInterval);

    let correct = 0;
    let wrong = 0;

    questions.forEach(q => {
      if (q.userAnswer === q.arti) correct++;
      else wrong++;
    });

    const scorePercent =
      Math.round((correct / totalQuestions) * 100);

    examBox.innerHTML = `
      <div class="text-center">

        <div class="text-2xl font-bold mb-4">
          Hasil Ujian
        </div>

        <div class="space-y-2 text-lg">
          <div class="text-green-600">
            Benar: ${correct}
          </div>
          <div class="text-red-600">
            Salah: ${wrong}
          </div>
          <div>
            Skor: ${scorePercent}%
          </div>
        </div>

        <button onclick="location.reload()"
          class="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl">
          Ulangi
        </button>

      </div>
    `;
  }

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  renderQuestion();
  startTimer();
}
