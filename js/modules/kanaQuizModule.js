export function initQuiz(data, mode = "normal") {

  const container = document.getElementById("quizBox");

  let score = 0;
  let timeLeft = 30;
  let timerInterval;
  let current;

  function startTimer() {

    const timerEl = document.getElementById("timer");

    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.innerText = timeLeft + "s";

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
         .slice(0,3)
         .map(d => d.romaji)
    ]);

    container.innerHTML = `
      <div class="flex justify-between mb-4 text-sm text-gray-500">
        <div>⏱ <span id="timer">${timeLeft}</span></div>
        <div>⭐ Score: ${score}</div>
      </div>

      <div class="text-6xl font-bold mb-6">
        ${current.char}
      </div>

      ${choices.map(c => `
        <button class="choice block w-full bg-gray-200 p-3 rounded-xl mb-2 hover:bg-gray-300 transition">
          ${c}
        </button>
      `).join("")}
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
        Skor Akhir: <span class="text-indigo-600 font-bold">${score}</span>
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
