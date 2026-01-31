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
  Object.entries(config.colors).forEach(([key, value]) => {
    if (!isValidHex(value)) {
      warnings.push(`Invalid color for ${key}! Using default.`);
      config.colors[key] = getDefaultColor(key);
    }
  });

  if (parseFloat(config.animations.floatDuration) < 5) {
    warnings.push("Float duration too short! Setting to 5s minimum.");
    config.animations.floatDuration = "5s";
  }

  if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
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
document.title = config.pageTitle;

// ---------- Helpers ----------
function showNextQuestion(questionNumber) {
  document.querySelectorAll(".question-section").forEach((q) => q.classList.add("hidden"));
  const el = document.getElementById(`question${questionNumber}`);
  if (el) el.classList.remove("hidden");
}

function moveButton(button) {
  const x = Math.random() * (window.innerWidth - button.offsetWidth);
  const y = Math.random() * (window.innerHeight - button.offsetHeight);
  button.style.position = "fixed";
  button.style.left = x + "px";
  button.style.top = y + "px";
}

function disableAndHide(...elements) {
  elements.forEach((el) => {
    if (!el) return;
    el.disabled = true;
    el.style.display = "none";
  });
}

// ---------- Floating elements ----------
function createFloatingElements() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  config.floatingEmojis.hearts.forEach((heart) => {
    const div = document.createElement("div");
    div.className = "heart";
    div.innerHTML = heart;
    setRandomPosition(div);
    container.appendChild(div);
  });

  config.floatingEmojis.bears.forEach((bear) => {
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

  // Force range to be 0–100
  loveMeter.min = 0;
  loveMeter.max = 100;
  loveMeter.value = 50; // starting point (change to 0 if you want)

  if (loveValue) loveValue.textContent = loveMeter.value;

  // No “beyond 100” effects anymore
  loveMeter.style.width = "100%";
  if (extraLove) extraLove.classList.add("hidden");
}

if (loveMeter) {
  loveMeter.addEventListener("input", () => {
    const value = parseInt(loveMeter.value, 10);
    if (loveValue) loveValue.textContent = value;

    // Keep it simple: max is 100, so always hide overflow message
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

  if (t) t.textContent = config.celebration.title;
  if (m) m.textContent = config.celebration.message;
  if (e) e.textContent = config.celebration.emojis;

  createHeartExplosion();
}

function createHeartExplosion() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  for (let i = 0; i < 50; i++) {
    const heart = document.createElement("div");
    const randomHeart =
      config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
    heart.innerHTML = randomHeart;
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

  if (!config.music.enabled) {
    musicControls.style.display = "none";
    return;
  }

  musicSource.src = config.music.musicUrl;
  bgMusic.volume = config.music.volume ?? 0.5;
  bgMusic.load();

  // IMPORTANT: default button text
  musicToggle.textContent = config.music.startText;

  // Autoplay is typically blocked — so we do NOT force it here.
  // (You set autoplay:false in config.js)
  if (config.music.autoplay) {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicToggle.textContent = config.music.stopText;
        })
        .catch(() => {
          musicToggle.textContent = config.music.startText;
        });
    }
  }

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic
        .play()
        .then(() => {
          musicToggle.textContent = config.music.stopText;
        })
        .catch(() => {
          // If browser blocks it, user needs another click or volume permission
          musicToggle.textContent = config.music.startText;
        });
    } else {
      bgMusic.pause();
      musicToggle.textContent = config.music.startText;
    }
  });
}

// ---------- Main init ----------
window.addEventListener("DOMContentLoaded", () => {
  validateConfig();

  // Texts from config
  const title = document.getElementById("valentineTitle");
  if (title) title.textContent = `${config.valentineName}, my love...`;

  document.getElementById("question1Text").textContent = config.questions.first.text;
  document.getElementById("yesBtn1").textContent = config.questions.first.yesBtn;
  document.getElementById("noBtn1").textContent = config.questions.first.noBtn;
  document.getElementById("secretAnswerBtn").textContent = config.questions.first.secretAnswer;

  document.getElementById("question2Text").textContent = config.questions.second.text;
  document.getElementById("startText").textContent = config.questions.second.startText;
  document.getElementById("nextBtn").textContent = config.questions.second.nextBtn;

  document.getElementById("question3Text").textContent = config.questions.third.text;
  document.getElementById("yesBtn3").textContent = config.questions.third.yesBtn;
  document.getElementById("noBtn3").textContent = config.questions.third.noBtn;

  createFloatingElements();
  setupMusicPlayer();

  // ---------- Button behavior: ask ONCE ----------
  const yesBtn1 = document.getElementById("yesBtn1");
  const noBtn1 = document.getElementById("noBtn1");
  const secretBtn = document.getElementById("secretAnswerBtn");

  const nextBtn = document.getElementById("nextBtn");

  const yesBtn3 = document.getElementById("yesBtn3");
  const noBtn3 = document.getElementById("noBtn3");

  // Q1: Yes -> go to love meter, and remove buttons so it can’t repeat
  if (yesBtn1) {
    yesBtn1.addEventListener("click", () => {
      disableAndHide(yesBtn1, noBtn1, secretBtn);
      showNextQuestion(2);
    });
  }

  // Q1: No -> move away (still fun), but NOT infinite “Yes”
  if (noBtn1) {
    noBtn1.addEventListener("click", () => {
      moveButton(noBtn1);
    });
  }

  // Secret button -> just shows next question (optional)
  if (secretBtn) {
    secretBtn.addEventListener("click", () => {
      disableAndHide(yesBtn1, noBtn1, secretBtn);
      showNextQuestion(2);
    });
  }

  // Q2 -> Next -> go to Q3 (one time)
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextBtn.disabled = true;
      showNextQuestion(3);
    });
  }

  // Q3: Yes -> celebrate (one time)
  if (yesBtn3) {
    yesBtn3.addEventListener("click", () => {
      disableAndHide(yesBtn3, noBtn3);
      celebrate();
    });
  }

  // Q3: No -> move away (classic)
  if (noBtn3) {
    noBtn3.addEventListener("click", () => {
      moveButton(noBtn3);
    });
  }
});
