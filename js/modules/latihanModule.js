import { getVocab } from "../services/vocabService.js";

const container = document.getElementById("quizContainer");
const scoreDisplay = document.getElementById("score");

let vocabData = [];
let currentQuestion = null;
let score = 0;
let answered = false;
let timer;
let timeLeft = 10; // detik

// ================= INIT =================
async function init() {
  vocabData = await getVocab();
  generateQuestion();
}

// ================= GENERATE QUESTION =================
function generateQuestion() {

  if (vocabData.length < 4) {
    container.innerHTML = "Minimal 4 kosakata dibutuhkan.";
    return;
  }

  answered = false;
  resetTimer();

  const randomIndex = Math.floor(Math.random() * vocabData.length);
  currentQuestion = vocabData[randomIndex];

  const choices = shuffleArray([
    currentQuestion.arti,
    ...getRandomChoices(currentQuestion.arti)
  ]);

  container.innerHTML = `
    <div class="mb-3">
      <div class="h-2 bg-gray-200 rounded">
        <div id="timeBar" class="h-2 bg-red-500 rounded transition-all"></div>
      </div>
    </div>

    <div class="text-xl font-bold mb-4 animate-fade">
      Arti dari: ${currentQuestion.kanji}
    </div>

    ${choices.map(choice => `
      <button 
        class="answerBtn block w-full bg-gray-200 p-3 rounded-xl mb-2 transition duration-300 transform hover:scale-105"
        data-answer="${choice}">
        ${choice}
      </button>
    `).join("")}
  `;

  document.querySelectorAll(".answerBtn").forEach(btn => {
    btn.addEventListener("click", () => checkAnswer(btn));
  });

  startTimer();
}

// ================= TIMER =================
function startTimer() {

  const timeBar = document.getElementById("timeBar");
  timeLeft = 10;

  timer = setInterval(() => {

    timeLeft--;

    timeBar.style.width = (timeLeft * 10) + "%";

    if (timeLeft <= 0) {
      clearInterval(timer);
      if (!answered) autoWrong();
    }

  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
}

// ================= AUTO SALAH =================
function autoWrong() {
  highlightAnswers(null);
}

// ================= CHECK =================
function checkAnswer(button) {

  if (answered) return;

  answered = true;
  resetTimer();

  highlightAnswers(button.dataset.answer);

  if (button.dataset.answer === currentQuestion.arti) {
    score++;
    scoreDisplay.innerText = "Skor: " + score;
  }
}

// ================= HIGHLIGHT =================
function highlightAnswers(selected) {

  const correct = currentQuestion.arti;
  const buttons = document.querySelectorAll(".answerBtn");

  buttons.forEach(btn => {

    btn.disabled = true;

    if (btn.dataset.answer === correct) {
      btn.classList.remove("bg-gray-200");
      btn.classList.add("bg-green-500", "text-white");
    }

    if (btn.dataset.answer === selected && selected !== correct) {
      btn.classList.remove("bg-gray-200");
      btn.classList.add("bg-red-500", "text-white");
    }
  });
}

// ================= NEXT =================
window.nextQuestion = function() {

  container.classList.add("opacity-0");

  setTimeout(() => {
    generateQuestion();
    container.classList.remove("opacity-0");
  }, 300);
};

// ================= HELPERS =================
function getRandomChoices(correct) {

  const others = vocabData
    .filter(item => item.arti !== correct)
    .map(item => item.arti);

  shuffleArray(others);

  return others.slice(0, 3);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// ================= START =================
init();
