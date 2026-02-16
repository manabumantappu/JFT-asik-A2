export function initQuiz(data, mode = "quiz") {

  const container = document.getElementById("quizBox");

  let score = 0;

  // ⏱ TIMER BERBEDA
  let timeLeft = mode === "speed" ? 30 : 60;

  let timerInterval;
  let current;

  function startTimer() {

    timerInterval = setInterval(() => {

      timeLeft--;

      const timerEl = document.getElementById("timer");
      if (timerEl) {
        timerEl.innerText = timeLeft + "s";
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame();
      }

    }, 1000);
  }

  function nextQuestion() {

    current = data[Math.floor(Math.random() * data.length)];

    const choices = shuffle([
      current.romaji,
      ...shuffle(data.filter(d => d.romaji !== current.romaji))
        .slice(0, 3)
        .map(d => d.romaji)
    ]);

   quizBox.innerHTML = `
  <div class="flex justify-between text-sm text-gray-500 mb-4">
    <div>⏳ ${timeLeft}s</div>
    <div>⭐ Score: ${score}</div>
  </div>

  <div class="flex items-center justify-center h-[30vh] sm:h-[220px]">

    <div id="kanaChar"
         class="kana-animate
                text-[26vw] sm:text-7xl md:text-8xl
                font-bold leading-none text-purple-700">
      ${question.char}
    </div>

  </div>

  <div class="space-y-4 mt-4">
    ${options.map(opt => `
      <button
        class="w-full py-4 rounded-2xl bg-gray-100
               text-lg font-semibold
               hover:bg-purple-200
               active:scale-95 transition"
        onclick="checkAnswer('${opt}')">
        ${opt}
      </button>
    `).join("")}
  </div>
`;


    document.querySelectorAll(".choice").forEach(btn => {
      btn.onclick = () => checkAnswer(btn.innerText);
    });
  }

  function checkAnswer(answer) {

    if (answer === current.romaji) {
      score++;
    }

    nextQuestion();
  }

  function endGame() {

    container.innerHTML = `
      <div class="text-2xl font-bold mb-4">
        ⏰ Waktu Habis!
      </div>

      <div class="text-xl mb-4">
        Skor Akhir: 
        <span class="text-indigo-600 font-bold">
          ${score}
        </span>
      </div>

      <button onclick="location.reload()"
        class="bg-indigo-600 text-white px-6 py-2 rounded-xl">
        Main Lagi
      </button>
    `;
  }

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  nextQuestion();
  startTimer();
}
setTimeout(() => {
  const kana = document.getElementById("kanaChar");
  if (kana) {
    kana.classList.remove("kana-animate");
    void kana.offsetWidth;
    kana.classList.add("kana-animate");
  }
}, 10);
