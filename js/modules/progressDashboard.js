import { db, auth } from "../firebase.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const statsBox = document.getElementById("statsBox");

auth.onAuthStateChanged(async (user) => {

  if (!user) {
    statsBox.innerHTML = "Harus login.";
    return;
  }

  const ref = doc(db, "progress", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    statsBox.innerHTML = "Belum ada data.";
    return;
  }

  const data = snap.data();

  const best = data.bestScore || 0;
  const last = data.lastScore || 0;
  const total = data.totalQuiz || 0;
  const xp = data.xp || 0;
  const streak = data.streak || 0;

  const accuracy = Math.round((best / 10) * 100);

  renderStats(best, last, total, accuracy, xp, streak);
  renderChart(best, last);
});


// ================= RENDER CARDS =================
function renderStats(best, last, total, accuracy, xp, streak) {

  const level = getLevel(total);
  const badge = getBadge(total);

  statsBox.innerHTML = `
    ${statCard("Level", level, "text-indigo-600")}
    ${statCard("Badge", badge, "text-yellow-500")}
    ${statCard("Best Score", best + " / 10", "text-green-600")}
    ${statCard("XP", xp, "text-purple-600")}
    ${statCard("Streak 🔥", streak + " hari", "text-red-500")}
    ${statCard("Akurasi", accuracy + "%", "text-blue-600")}
  `;
}


// ================= LEVEL SYSTEM =================
function getLevel(totalQuiz) {
  if (totalQuiz >= 10) return "Advanced";
  if (totalQuiz >= 4) return "Intermediate";
  return "Beginner";
}

function getBadge(totalQuiz) {
  if (totalQuiz >= 10) return "🏆 Master";
  if (totalQuiz >= 4) return "🥈 Learner";
  return "🥉 Starter";
}


// ================= CARD TEMPLATE =================
function statCard(title, value, color) {
  return `
    <div class="bg-white p-4 rounded-2xl shadow">
      <div class="text-sm text-gray-500">${title}</div>
      <div class="text-2xl font-bold ${color}">
        ${value}
      </div>
    </div>
  `;
}


// ================= CHART =================
function renderChart(best, last) {

  const ctx = document.getElementById("progressChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Best Score", "Last Score"],
      datasets: [{
        label: "Skor",
        data: [best, last]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 10
        }
      }
    }
  });
}
