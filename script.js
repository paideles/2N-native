let texto = document.getElementById("texto");
let resultado = document.getElementById("resultado");

let idiomaEntrada = document.getElementById("idiomaEntrada");
let idiomaSaida = document.getElementById("idiomaSaida");

let cache = JSON.parse(localStorage.getItem("traducaoCache")) || {};

function falar(frase){

let voz = new SpeechSynthesisUtterance(frase);
speechSynthesis.speak(voz);

}

async function traduzir(){

let frase = texto.value;

let chave = frase + "_" + idiomaSaida.value;

if(cache[chave]){

resultado.innerText = cache[chave];
falar(cache[chave]);

return;

}

try{

let url = "https://api.mymemory.translated.net/get?q="
+ encodeURIComponent(frase)
+ "&langpair="
+ idiomaEntrada.value
+ "|"
+ idiomaSaida.value;

let resposta = await fetch(url);

let dados = await resposta.json();

let traducao = dados.responseData.translatedText;

resultado.innerText = traducao;

cache[chave] = traducao;

localStorage.setItem("traducaoCache", JSON.stringify(cache));

falar(traducao);

}catch(e){

resultado.innerText = "Sem internet e tradução não salva.";

}

}

document.getElementById("traduzir").onclick = traduzir;

let reconhecimento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

reconhecimento.lang = "pt-BR";

reconhecimento.onresult = function(event){

let fala = event.results[0][0].transcript;

texto.value = fala;

traduzir();

}

document.getElementById("microfone").onclick = () => {

reconhecimento.start();

}