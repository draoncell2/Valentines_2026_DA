// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
  const warnings = [];

  if (!config.valentineName) {
    warnings.push("Valentine's name is not set! Using default.");
    config.valentineName = "My Love";
  }

  const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  if (config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      if (!isValidHex(value)) {
        warnings.push(`Invalid color for ${key}! Using default.`);
        config.colors[key] = getDefaultColor(key);
      }
    });
  }

  if (config.animations && parseFloat(config.animations.floatDuration) < 5) {
    warnings.push("Float duration too short! Setting to 5s minimum.");
    config.animations.floatDuration = "5s";
  }

  if (
    config.animations &&
    (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3)
  ) {
    warnings.push("Heart explosion size should be between 1 and 3! Using default.");
    config.animations.heartExplosionSize = 1.5;
  }

  if (warnings.length > 0) {
    console.warn("⚠️ Configuration Warnings:");
    warnings.forEach((warning) => console.warn("- " + warning));
  }
}

function getDefaultColor(key) {
  const defaults = {
    backgroundStart: "#ffafbd",
    backgroundEnd: "#ffc3a0",
    buttonBackground: "#ff6b6b",
    buttonHover: "#ff8787",
    textColor: "#ff4757",
  };
  return defaults[key];
}

// Set page title
document.title = config.pageTitle || "Valentine";

// ---------- Helpers ----------
function showNextQuestion(questionNumber) {
  document.querySelectorAll(".question-section").forEach((q) => q.classList.add("hidden"));
  const el = document.getElementById(`question${questionNumber}`);
  if (el) el.classList.remove("hidden");
}

function disableAndHide(...elements) {
  elements.forEach((el) => {
    if (!el) return;
    el.disabled = true;
    el.style.display = "none";
  });
}

// Move button (ONLY for NO buttons)
function moveButton(button) {
  if (!button) return;

  const padding = 20;
  const maxX = window.innerWidth - button.offsetWidth - padding;
  const maxY = window.innerHeight - button.offsetHeight - padding;

  const x = Math.max(padding, Math.floor(Math.random() * maxX));
  const y = Math.max(padding, Math.floor(Math.random() * maxY));

  button.style.position = "fixed";
  button.style.left = x + "px";
  button.style.top = y + "px";
}

// ---------- Floating elements ----------
function createFloatingElements() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  (config.floatingEmojis?.hearts || []).forEach((heart) => {
    const div = document.createElement("div");
    div.className = "heart";
    div.innerHTML = heart;
    setRandomPosition(div);
    container.appendChild(div);
  });

  (config.floatingEmojis?.bears || []).forEach((bear) => {
    const div = document.createElement("div");
    div.className = "bear";
    div.innerHTML = bear;
    setRandomPosition(div);
    container.appendChild(div);
  });
}

function setRandomPosition(element) {
  element.style.left = Math.random() * 100 + "vw";
  element.style.animationDelay = Math.random() * 5 + "s";
  element.style.animationDuration = 10 + Math.random() * 20 + "s";
}

// ---------- Love meter (0–100 ONLY) ----------
const loveMeter = document.getElementById("loveMeter");
const loveValue = document.getElementById("loveValue");
const extraLove = document.getElementById("extraLove");

function setInitialPosition() {
  if (!loveMeter) return;

  loveMeter.min = 0;
  loveMeter.max = 100;
  loveMeter.value = 50; // change to 0 or 100 if you want

  if (loveValue) loveValue.textContent = loveMeter.value;

  loveMeter.style.width = "100%";
  if (extraLove) extraLove.classList.add("hidden");
}

if (loveMeter) {
  loveMeter.addEventListener("input", () => {
    const value = parseInt(loveMeter.value, 10);
    if (loveValue) loveValue.textContent = value;

    if (extraLove) {
      extraLove.classList.add("hidden");
      extraLove.classList.remove("super-love");
    }
    loveMeter.style.width = "100%";
  });
}

window.addEventListener("DOMContentLoaded", setInitialPosition);
window.addEventListener("load", setInitialPosition);

// ---------- Celebration ----------
function celebrate() {
  document.querySelectorAll(".question-section").forEach((q) => q.classList.add("hidden"));

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

function createHeartExplosion() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const heart = document.createElement("div");
    const hearts = config.floatingEmojis?.hearts || ["💖"];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.className = "heart";
    container.appendChild(heart);
    setRandomPosition(heart);
  }
}

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

  musicSource.src = config.music.musicUrl;
  bgMusic.volume = config.music.volume ?? 0.5;
  bgMusic.load();

  musicToggle.textContent = config.music.startText || "Play Music";

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play()
        .then(() => (musicToggle.textContent = config.music.stopText || "Stop Music"))
        .catch(() => (musicToggle.textContent = config.music.startText || "Play Music"));
    } else {
      bgMusic.pause();
      musicToggle.textContent = config.music.startText || "Play Music";
    }
  });
}

// ---------- Main init ----------
window.addEventListener("DOMContentLoaded", () => {
  validateConfig();

  // Texts from config (safe checks so it never crashes)
  const title = document.getElementById("valentineTitle");
  if (title) title.textContent = `${config.valentineName}, my love...`;

  const q1 = document.getElementById("question1Text");
  const yesBtn1 = document.getElementById("yesBtn1");
  const noBtn1 = document.getElementById("noBtn1");

  const q2 = document.getElementById("question2Text");
  const startText = document.getElementById("startText");
  const nextBtn = document.getElementById("nextBtn");

  const q3 = document.getElementById("question3Text");
  const yesBtn3 = document.getElementById("yesBtn3");
  const noBtn3 = document.getElementById("noBtn3");

  if (q1) q1.textContent = config.questions?.first?.text || "";
  if (yesBtn1) yesBtn1.textContent = config.questions?.first?.yesBtn || "Yes";
  if (noBtn1) noBtn1.textContent = config.questions?.first?.noBtn || "No";

  if (q2) q2.textContent = config.questions?.second?.text || "";
  if (startText) startText.textContent = config.questions?.second?.startText || "";
  if (nextBtn) nextBtn.textContent = config.questions?.second?.nextBtn || "Next";

  if (q3) q3.textContent = config.questions?.third?.text || "";
  if (yesBtn3) yesBtn3.textContent = config.questions?.third?.yesBtn || "Yes";
  if (noBtn3) noBtn3.textContent = config.questions?.third?.noBtn || "No";

  createFloatingElements();
  setupMusicPlayer();

  // ---------- Button behavior ----------
  // YES never moves, only works once
  if (yesBtn1) {
    yesBtn1.addEventListener("click", () => {
      disableAndHide(yesBtn1, noBtn1);
      showNextQuestion(2);
    });
  }

  // NO moves only a few times, then stops
  let no1MovesLeft = 4;
  if (noBtn1) {
    noBtn1.addEventListener("click", () => {
      if (no1MovesLeft <= 0) return;
      no1MovesLeft--;
      moveButton(noBtn1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextBtn.disabled = true;
      showNextQuestion(3);
    });
  }

  if (yesBtn3) {
    yesBtn3.addEventListener("click", () => {
      disableAndHide(yesBtn3, noBtn3);
      celebrate();
    });
  }

  let no3MovesLeft = 4;
  if (noBtn3) {
    noBtn3.addEventListener("click", () => {
      if (no3MovesLeft <= 0) return;
      no3MovesLeft--;
      moveButton(noBtn3);
    });
  }
});
