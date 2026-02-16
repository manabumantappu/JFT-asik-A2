export function initKanaExam(data, duration = 60) {

  const container = document.getElementById("examBox");

  let score = 0;
  let correct = 0;
  let wrong = 0;
  let timeLeft = duration;
  let timerInterval;
  let current;

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      const timerEl = document.getElementById("timer");
      if (timerEl) timerEl.innerText = timeLeft + "s";

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

    container.innerHTML = `
      <div class="flex justify-between text-sm text-gray-500 mb-4">
        <div>⏳ <span id="timer">${timeLeft}s</span></div>
        <div>✅ ${correct} ❌ ${wrong}</div>
      </div>

      <div class="flex items-center justify-center h-[32vh] sm:h-[240px]">
        <div class="kana-animate
                    text-[28vw] sm:text-7xl md:text-8xl
                    font-bold leading-none text-indigo-700">
          ${current.char}
        </div>
      </div>

      <div class="space-y-4 mt-4">
        ${choices.map(opt => `
          <button
            class="choice w-full py-4 rounded-2xl bg-gray-100
                   text-lg font-semibold
                   transition">
            ${opt}
          </button>
        `).join("")}
      </div>
    `;

    document.querySelectorAll(".choice").forEach(btn => {
      btn.onclick = () => checkAnswer(btn);
    });
  }

  function checkAnswer(button) {

    const selected = button.innerText;

    document.querySelectorAll(".choice").forEach(btn => {
      btn.disabled = true;

      if (btn.innerText === current.romaji) {
        btn.classList.add("bg-green-500","text-white");
      }
    });

    if (selected === current.romaji) {
      score++;
      correct++;
      button.classList.add("bg-green-500","text-white");
    } else {
      wrong++;
      button.classList.add("bg-red-500","text-white");
    }

    setTimeout(() => {
      nextQuestion();
    }, 700);
  }

  function endGame() {
    container.innerHTML = `
      <div class="text-center">

        <div class="text-3xl font-bold mb-4 text-indigo-700">
          ⏰ Waktu Habis!
        </div>

        <div class="space-y-2 text-lg">
          <div>Skor Total: <span class="font-bold">${score}</span></div>
          <div class="text-green-600">Benar: ${correct}</div>
          <div class="text-red-600">Salah: ${wrong}</div>
        </div>

        <button onclick="location.reload()"
          class="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-2xl
                 hover:scale-105 active:scale-95 transition">
          Ulangi Ujian
        </button>

      </div>
    `;
  }

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  nextQuestion();
  startTimer();
}
