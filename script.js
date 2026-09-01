const audio = document.querySelector("#audio");
const playButton = document.querySelector("#play-button");
const progress = document.querySelector("#progress");
const currentTime = document.querySelector("#current-time");
const duration = document.querySelector("#duration");

const now = new Date();
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const firstDay = new Date(2026, 0, 1);
const daysSinceFirstDay = Math.floor((startOfToday - firstDay) / 86400000);

const dailyNotes = [
  "Seu sorriso é muito bonito, caso ninguém tenha falado isso hoje.",
  "Seu cabelo tem personalidade própria e eu gosto disso.",
  "Você sabe montar um look muito bem, tenho que admitir.",
  "Você fica bonita até quando diz que está acabada.",
  "Seu cabelo provavelmente está melhor do que você acha.",
  "Você tem um rosto muito bonito. É só uma constatação mesmo.",
  "Seu sorriso nas fotos sempre fica bom.",
  "Você combina muito com as coisas que escolhe usar.",
  "Hoje você está bonita. Fonte: eu decidi.",
  "Seu jeito de rir é uma das coisas mais legais em você.",
  "Você consegue fazer qualquer roupa parecer mais interessante.",
  "Seu cabelo fica bonito de vários jeitos, o que é meio injusto.",
  "Você tem bom gosto. A playlist é uma prova.",
  "Você é muito fotogênica quando esquece que tem uma câmera perto.",
  "Seu sorriso melhora muito qualquer foto.",
  "Você tem umas expressões muito engraçadas — elogio, tá?",
  "Seu estilo é reconhecível. Eu bateria o olho e saberia que é seu.",
  "Você fica especialmente bonita quando está falando de algo que gosta.",
  "Seu cabelo merece um dia bom hoje. Você também.",
  "Você tem cara de protagonista de clipe da Taylor às vezes.",
  "Você sabe ser fofa sem ficar tentando ser fofa.",
  "Se olhe com um pouco menos de implicância hoje.",
  "Você é mais legal ao vivo do que no close friends — e isso diz muito.",
  "A música é da Taylor, mas quem está servindo hoje é você.",
  "Pronto, seu elogio do dia foi entregue. Pode seguir sendo bonita.",
];

function noteForDay(index) {
  return dailyNotes[index % dailyNotes.length];
}

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

async function loadSong() {
  try {
    const response = await fetch("songs.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
    const songs = await response.json();
    const index = ((daysSinceFirstDay % songs.length) + songs.length) % songs.length;
    const song = songs[index];

    document.querySelector("#song-title").textContent = song.title;
    document.querySelector("#artist").textContent = song.artist;
    document.querySelector("#note").textContent = `“${noteForDay(index)}”`;
    audio.src = song.file;
  } catch (error) {
    document.querySelector("#song-title").textContent = "A música está descansando";
    document.querySelector("#artist").textContent = "Tente novamente em instantes";
    document.querySelector("#note").textContent = "“Hoje o elogio fica para depois, mas você continua incrível.”";
    playButton.disabled = true;
    console.error(error);
  }
}

playButton.addEventListener("click", async () => {
  if (audio.paused) await audio.play();
  else audio.pause();
});

audio.addEventListener("play", () => {
  playButton.textContent = "❚❚";
  playButton.setAttribute("aria-label", "Pausar música");
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Tocar música");
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);
  progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
});

audio.addEventListener("ended", () => {
  progress.value = 0;
  audio.currentTime = 0;
});

progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});

document.querySelector("#today").textContent = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "long", year: "numeric",
}).format(now).toUpperCase();

loadSong();
