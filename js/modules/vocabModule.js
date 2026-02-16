const list = document.getElementById("vocabList");
const search = document.getElementById("search");

function render(data){
list.innerHTML="";
data.forEach(item=>{
list.innerHTML+=`
<div class="bg-white p-4 rounded-xl shadow">
<h2 class="font-bold">${item.kanji}</h2>
<p>${item.hiragana}</p>
<p class="text-blue-600">${item.arti}</p>
</div>`;
});
}

search.addEventListener("input",()=>{
const filtered=vocabData.filter(v=>
v.kanji.includes(search.value)||
v.arti.includes(search.value)
);
render(filtered);
});

render(vocabData);
