let time=600;
let current=0;
let answers=[];
let timer=setInterval(()=>{
time--;
let m=Math.floor(time/60);
let s=time%60;
document.getElementById("timer").textContent=
`${m}:${s.toString().padStart(2,"0")}`;
if(time<=0) finish();
},1000);

function loadQuiz(){
const q=questionData[current];
document.getElementById("quizBox").innerHTML=`
<h2 class="font-semibold mb-3">${q.question}</h2>
${q.options.map((opt,i)=>`
<button onclick="select(${i})"
class="block w-full text-left p-3 border rounded-xl mb-2">${opt}</button>
`).join("")}
`;
}

function select(i){
answers[current]=i;
current++;
if(current<questionData.length){
loadQuiz();
}else{
finish();
}
}

function finish(){
clearInterval(timer);
let score=0;
questionData.forEach((q,i)=>{
if(answers[i]===q.answer) score++;
});
document.getElementById("quizBox").classList.add("hidden");
document.getElementById("resultBox").classList.remove("hidden");
document.getElementById("resultBox").innerHTML=
`<h2 class="text-xl font-bold">Skor: ${score}/${questionData.length}</h2>`;
}

loadQuiz();
