// Initialize configuration
const config = window.VALENTINE_CONFIG;

// ---------- Helpers ----------
function showNextQuestion(questionNumber) {
  document.querySelectorAll(".question-section").forEach(q => q.classList.add("hidden"));
  const el = document.getElementById(`question${questionNumber}`);
  if (el) el.classList.remove("hidden");
}

function moveButton(button) {
  if (!button) return;
  const x = Math.random() * (window.innerWidth - button.offsetWidth);
  const y = Math.random() * (window.innerHeight - button.offsetHeight);
  button.style.position = "fixed";
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
}

function disableAndHide(...elements) {
  elements.forEach(el => {
    if (!el) return;
    el.disabled = true;
    el.style.display = "none";
  });
}

// (optional) make helpers accessible if anything else calls them
window.showNextQuestion = showNextQuestion;
window.moveButton = moveButton;

// ---------- Floating elements ----------
function setRandomPosition(element) {
  element.style.left = Math.random() * 100 + "vw";
  element.style.animationDelay = Math.random() * 5 + "s";
  element.style.animationDuration = 10 + Math.random() * 20 + "s";
}

function createFloatingElements() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  (config.floatingEmojis?.hearts || []).forEach(heart => {
    const div = document.createElement("div");
    div.className = "heart";
    div.innerHTML = heart;
    setRandomPosition(div);
    container.appendChild(div);
  });

  (config.floatingEmojis?.bears || []).forEach(bear => {
    const div = document.createElement("div");
    div.className = "bear";
    div.innerHTML = bear;
    setRandomPosition(div);
    container.appendChild(div);
  });
}

// ---------- Love meter (0–100 only) ----------
function setupLoveMeter() {
  const loveMeter = document.getElementById("loveMeter");
  const loveValue = document.getElementById("loveValue");
  const extraLove = document.getElementById("extraLove");

  if (!loveMeter) return;

  loveMeter.min = 0;
  loveMeter.max = 100;

  const sync = () => {
    const value = parseInt(loveMeter.value, 10);
    if (loveValue) loveValue.textContent = value;
    if (extraLove) extraLove.classList.add("hidden"); // no “beyond 100”
    loveMeter.style.width = "100%";
  };

  sync();
  loveMeter.addEventListener('input', () => {
  const value = parseInt(loveMeter.value, 10);
  loveValue.textContent = value;

  // show the message area
  extraLove.classList.remove('hidden');
  extraLove.classList.remove('super-love');

  if (value >= 90) {
    extraLove.textContent = config.loveMessages.extreme;   // 90–100
  } else if (value >= 60) {
    extraLove.textContent = config.loveMessages.high;      // 60–89
  } else {
    extraLove.textContent = config.loveMessages.normal;    // 0–59
  }
});

}

// ---------- Celebration ----------
function createHeartExplosion() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const heart = document.createElement("div");
    const hearts = config.floatingEmojis?.hearts || ["❤️"];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.className = "heart";
    container.appendChild(heart);
    setRandomPosition(heart);
  }
}

function celebrate() {
  document.querySelectorAll(".question-section").forEach(q => q.classList.add("hidden"));
  const celebrationEl = document.getElementById("celebration");
  if (celebrationEl) celebrationEl.classList.remove("hidden");

  const t = document.getElementById("celebrationTitle");
  const m = document.getElementById("celebrationMessage");
  const e = document.getElementById("celebrationEmojis");

  if (t) t.textContent = config.celebration?.title || "Yay! 🎉";
  if (m) m.textContent = config.celebration?.message || "";
  if (e) e.textContent = config.celebration?.emojis || "💖";

  createHeartExplosion();
}
window.celebrate = celebrate;

// ---------- Music ----------
function setupMusicPlayer() {
  const musicControls = document.getElementById("musicControls");
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  const musicSource = document.getElementById("musicSource");

  if (!musicControls || !musicToggle || !bgMusic || !musicSource) return;

  if (!config.music?.enabled) {
    musicControls.style.display = "none";
    return;
  }

  musicSource.src = config.music.musicUrl;   // "music.mp3"
  bgMusic.volume = config.music.volume ?? 0.5;
  bgMusic.load();

  // Always require click (autoplay is often blocked)
  musicToggle.textContent = config.music.startText || "🎵 Play Music";

  musicToggle.addEventListener("click", async () => {
    try {
      if (bgMusic.paused) {
        await bgMusic.play();
        musicToggle.textContent = config.music.stopText || "🔇 Stop Music";
      } else {
        bgMusic.pause();
        musicToggle.textContent = config.music.startText || "🎵 Play Music";
      }
    } catch (e) {
      // If it fails, it's usually browser restrictions
      musicToggle.textContent = config.music.startText || "🎵 Play Music";
      console.log("Audio play blocked:", e);
    }
  });
}

// ---------- Main init ----------
window.addEventListener("DOMContentLoaded", () => {
  // Texts
  const title = document.getElementById("valentineTitle");
  if (title) title.textContent = `${config.valentineName}, my love...`;

  const q1 = document.getElementById("question1Text");
  const y1 = document.getElementById("yesBtn1");
  const n1 = document.getElementById("noBtn1");

  const q2 = document.getElementById("question2Text");
  const st = document.getElementById("startText");
  const nx = document.getElementById("nextBtn");

  const q3 = document.getElementById("question3Text");
  const y3 = document.getElementById("yesBtn3");
  const n3 = document.getElementById("noBtn3");

  if (q1) q1.textContent = config.questions.first.text;
  if (y1) y1.textContent = config.questions.first.yesBtn;
  if (n1) n1.textContent = config.questions.first.noBtn;

  if (q2) q2.textContent = config.questions.second.text;
  if (st) st.textContent = config.questions.second.startText;
  if (nx) nx.textContent = config.questions.second.nextBtn;

  if (q3) q3.textContent = config.questions.third.text;
  if (y3) y3.textContent = config.questions.third.yesBtn;
  if (n3) n3.textContent = config.questions.third.noBtn;

  createFloatingElements();
  setupMusicPlayer();
  setupLoveMeter();

  // Behavior:
  // Q1 YES = go to Q2 (once)
  if (y1) {
    y1.addEventListener("click", () => {
      disableAndHide(y1, n1);
      showNextQuestion(2);
    });
  }

  // Q1 NO = runs away
  if (n1) {
    n1.addEventListener("click", () => moveButton(n1));
  }

  // Q2 NEXT = go to Q3
  if (nx) {
    nx.addEventListener("click", () => {
      nx.disabled = true;
      showNextQuestion(3);
    });
  }

  // Q3 YES = celebrate
  if (y3) {
    y3.addEventListener("click", () => {
      disableAndHide(y3, n3);
      celebrate();
    });
  }

  // Q3 NO = runs away
  if (n3) {
    n3.addEventListener("click", () => moveButton(n3));
  }
});
