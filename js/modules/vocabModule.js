import { getVocab } from "../services/vocabService.js";

const container = document.getElementById("vocabContainer");
const searchInput = document.getElementById("searchInput");

let vocabData = [];
let flashMode = false;

// Load vocab
async function loadVocab() {
  vocabData = await getVocab();
  renderVocab(vocabData);
}

// Render vocab
function renderVocab(data) {

  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-500">
        Data tidak ditemukan
      </div>
    `;
    return;
  }

  data.forEach(item => {

    const card = document.createElement("div");
    card.className =
      "bg-white p-5 rounded-2xl shadow transition transform active:scale-95";

    if (flashMode) {

      card.classList.add("text-center", "cursor-pointer");

      card.innerHTML = `
        <div class="text-2xl font-bold">${item.kanji}</div>
        <div class="hidden mt-3 text-gray-600">${item.arti}</div>
      `;

      card.onclick = () => {
        const arti = card.querySelector("div:nth-child(2)");
        arti.classList.toggle("hidden");
      };

    } else {

      card.innerHTML = `
        <div class="text-lg font-bold">${item.kanji}</div>
        <div class="text-sm text-gray-500">${item.romaji}</div>
        <div class="text-sm mt-1">${item.arti}</div>
      `;
    }

    container.appendChild(card);
  });
}

// Search
searchInput.addEventListener("input", () => {

  const keyword = searchInput.value.toLowerCase();

  const filtered = vocabData.filter(item =>
    item.kanji.toLowerCase().includes(keyword) ||
    item.romaji.toLowerCase().includes(keyword) ||
    item.arti.toLowerCase().includes(keyword)
  );

  renderVocab(filtered);
});

// Toggle flash mode
window.toggleMode = function () {
  flashMode = !flashMode;
  renderVocab(vocabData);
};

// Init
loadVocab();
