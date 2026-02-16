import { getVocab } from "../services/vocabService.js";
import { saveQuizResult } from "../services/progressService.js";

let vocabData = [];
let quizSet = [];
let currentIndex = 0;
let score = 0;
const TOTAL_QUESTIONS = 10;

const cardContainer = document.getElementById("cardContainer");
const progressText = document.getElementById("progress");
const buttons = document.getElementById("buttons");
const resultBox = document.getElementById("result");

// ================= INIT =================
async function init() {
  vocabData = await getVocab();
  startQuiz();
}

// ================= START QUIZ =================
function startQuiz() {

  shuffleArray(vocabData);
  quizSet = vocabData.slice(0, TOTAL_QUESTIONS);

  currentIndex = 0;
  score = 0;

  showCard();
}

// ================= SHOW CARD =================
function showCard() {

  if (currentIndex >= quizSet.length) {
    showResult();
    return;
  }

  const item = quizSet[currentIndex];

  progressText.innerText =
    `Soal ${currentIndex + 1} / ${TOTAL_QUESTIONS}`;

  cardContainer.innerHTML = `
    <div class="card w-72 h-48 cursor-pointer" onclick="flipCard(this)">
      <div class="card-inner bg-white rounded-2xl shadow-lg h-full flex items-center justify-center relative">

        <div class="card-front absolute w-full h-full flex items-center justify-center text-3xl font-bold">
          ${item.kanji}
        </div>

        <div class="card-back absolute w-full h-full flex items-center justify-center text-lg text-gray-700">
          ${item.arti}
        </div>

      </div>
    </div>
  `;

  buttons.classList.add("hidden");
}

// ================= FLIP =================
window.flipCard = function(card) {
  card.classList.toggle("flip");
  buttons.classList.remove("hidden");
};

// ================= MARK =================
window.markCorrect = function() {
  score++;
  next();
};

window.markWrong = function() {
  next();
};

function next() {
  currentIndex++;
  buttons.classList.add("hidden");
  showCard();
}

// ================= RESULT =================
async function showResult() {

  await saveQuizResult(score, TOTAL_QUESTIONS);

  cardContainer.innerHTML = "";
  buttons.classList.add("hidden");

  resultBox.classList.remove("hidden");

  resultBox.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Hasil Quiz</h2>
    <p class="text-lg mb-2">Skor: ${score} / ${TOTAL_QUESTIONS}</p>
    <p class="text-sm text-gray-500 mb-4">
      Skor tersimpan ke progress
    </p>
    <button onclick="location.reload()"
      class="bg-blue-600 text-white px-4 py-2 rounded-xl">
      Ulangi Quiz
    </button>
  `;
}

// ================= HELPER =================
function shuffleArray(array) {
  array.sort(() => Math.random() - 0.5);
}

// ================= START =================
init();
