import { getVocab } from "../services/vocabService.js";

const container = document.getElementById("vocabContainer");
const searchInput = document.getElementById("searchInput");

let vocabData = [];
let currentIndex = 0;
let flashMode = false;

// ================= LOAD DATA =================
async function loadVocab() {
  vocabData = await getVocab();
  renderList(vocabData);
}

// ================= LIST MODE =================
function renderList(data) {

  container.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-2xl shadow";

    card.innerHTML = `
      <div class="text-lg font-bold">${item.kanji}</div>
      <div class="text-sm text-gray-500">${item.romaji}</div>
      <div class="text-sm mt-1">${item.arti}</div>
    `;

    container.appendChild(card);
  });
}

// ================= FLASHCARD MODE =================
function renderFlashcard() {

  if (vocabData.length === 0) return;

  const item = vocabData[currentIndex];

  container.innerHTML = `
    <div class="bg-white p-8 rounded-2xl shadow text-center">
      <div id="flashKanji" class="text-3xl font-bold cursor-pointer">
        ${item.kanji}
      </div>
      <div id="flashArti" class="hidden mt-4 text-gray-600 text-lg">
        ${item.arti}
      </div>

      <div class="flex justify-between mt-6">
        <button onclick="prevCard()" 
          class="bg-gray-300 px-4 py-2 rounded-xl">
          ◀ Prev
        </button>

        <button onclick="shuffleCards()" 
          class="bg-purple-500 text-white px-4 py-2 rounded-xl">
          🔀 Shuffle
        </button>

        <button onclick="nextCard()" 
          class="bg-blue-600 text-white px-4 py-2 rounded-xl">
          Next ▶
        </button>
      </div>

      <button onclick="startQuizFromVocab()" 
        class="mt-4 w-full bg-green-600 text-white p-3 rounded-xl">
        Mode Quiz
      </button>
    </div>
  `;

  document.getElementById("flashKanji").onclick = () => {
    document.getElementById("flashArti")
      .classList.toggle("hidden");
  };
}

// ================= NAVIGATION =================
window.nextCard = function () {
  currentIndex = (currentIndex + 1) % vocabData.length;
  renderFlashcard();
};

window.prevCard = function () {
  currentIndex =
    (currentIndex - 1 + vocabData.length) % vocabData.length;
  renderFlashcard();
};

window.shuffleCards = function () {
  vocabData.sort(() => Math.random() - 0.5);
  currentIndex = 0;
  renderFlashcard();
};

// ================= SEARCH =================
searchInput.addEventListener("input", () => {

  const keyword = searchInput.value.toLowerCase();

  const filtered = vocabData.filter(item =>
    item.kanji.toLowerCase().includes(keyword) ||
    item.romaji.toLowerCase().includes(keyword) ||
    item.arti.toLowerCase().includes(keyword)
  );

  renderList(filtered);
});

// ================= TOGGLE MODE =================
window.toggleMode = function () {
  flashMode = !flashMode;

  if (flashMode) {
    renderFlashcard();
  } else {
    renderList(vocabData);
  }
};

// ================= QUIZ MODE =================
// ================= QUIZ MODE =================
window.startQuizFromVocab = function () {

  renderQuizQuestion();
};

function renderQuizQuestion() {

  const question = vocabData[currentIndex];

  const choices = shuffleArray([
    question.arti,
    ...getRandomChoices(question.arti)
  ]);

  container.innerHTML = `
    <div class="bg-white p-6 rounded-2xl shadow">
      <div class="text-xl font-bold mb-4">
        Arti dari: ${question.kanji}
      </div>

      ${choices.map(choice => `
        <button 
          class="quiz-option block w-full bg-gray-100 text-black p-3 rounded-xl mb-2 transition"
          data-answer="${choice.replace(/"/g, "&quot;")}"
          onclick="checkAnswer(this)">
          ${choice}
        </button>
      `).join("")}
    </div>
  `;
}

window.checkAnswer = function(button) {

  const correct = vocabData[currentIndex].arti;
  const selected = button.dataset.answer;

  const buttons = document.querySelectorAll(".quiz-option");

  // Disable semua tombol
  buttons.forEach(btn => btn.disabled = true);

  if (selected === correct) {

    button.classList.remove("bg-gray-100");
    button.classList.add("bg-green-500", "text-white");

  } else {

    button.classList.remove("bg-gray-100");
    button.classList.add("bg-red-500", "text-white");

    // Highlight jawaban benar
    buttons.forEach(btn => {
      if (btn.dataset.answer === correct) {
        btn.classList.add("bg-green-500", "text-white");
      }
    });
  }

  // Auto lanjut ke soal berikutnya
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % vocabData.length;
    renderQuizQuestion();
  }, 800);
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

// ================= INIT =================
loadVocab();
