// Initialize configuration
const config = window.VALENTINE_CONFIG;

// ---------- Helpers ----------
function showNextQuestion(questionNumber) {
  const sections = document.querySelectorAll(".question-section");
  sections.forEach((q) => q.classList.add("hidden"));

  const target = document.getElementById(`question${questionNumber}`);
  if (!target) {
    console.error(`Missing element: #question${questionNumber}`);
    // If the target doesn't exist, unhide question1 so the page never looks "stuck"
    const q1 = document.getElementById("question1");
    if (q1) q1.classList.remove("hidden");
    return;
  }
  target.classList.remove("hidden");
}

function disableAndHide(...elements) {
  elements.forEach((el) => {
    if (!el) return;
    el.disabled = true;
    el.style.display = "none";
  });
}

function moveButton(button) {
  const x = Math.random() * (window.innerWidth - button.offsetWidth);
  const y = Math.random() * (window.innerHeight - button.offsetHeight);
  button.style.position = "fixed";
  button.style.left = x + "px";
  button.style.top = y + "px";
}

// ---------- Love meter (0–100 ONLY) ----------
function initLoveMeter() {
  const loveMeter = document.getElementById("loveMeter");
  const loveValue = document.getElementById("loveValue");
  const extraLove = document.getElementById("extraLove"); // optional, can exist or not

  if (!loveMeter) return;

  loveMeter.min = 0;
  loveMeter.max = 100;

  // If your HTML has value="50" this will match it, otherwise it will default to 50
  if (!loveMeter.value) loveMeter.value = 50;

  if (loveValue) loveValue.textContent = loveMeter.value;

  if (extraLove) extraLove.classList.add("hidden");

  loveMeter.addEventListener("input", () => {
    if (loveValue) loveValue.textContent = loveMeter.value;
    if (extraLove) extraLove.classList.add("hidden");
  });
}

// ---------- Music ----------
function setupMusicPlayer() {
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  const musicSource = document.getElementById("musicSource");

  if (!musicToggle || !bgMusic || !musicSource) {
    console.error("Music elements missing in index.html");
    return;
  }

  // Set source and load
  musicSource.src = config.music.musicUrl;
  bgMusic.volume = config.music.volume ?? 0.5;
  bgMusic.load();

  // Autoplay is often blocked; rely on user click.
  musicToggle.textContent = config.music.startText;

  musicToggle.addEventListener("click", async () => {
    try {
      if (bgMusic.paused) {
        await bgMusic.play();
        musicToggle.textContent = config.music.stopText;
      } else {
        bgMusic.pause();
        musicToggle.textContent = config.music.startText;
      }
    } catch (e) {
      console.log("Music play blocked or file not found:", e);
      musicToggle.textContent = config.music.startText;
      alert("Music didn’t play. Check the music URL and try again.");
    }
  });
}

// ---------- Main ----------
window.addEventListener("DOMContentLoaded", () => {
  // Hide / remove the secret button completely (no skipping)
  const secretBtn = document.getElementById("secretAnswerBtn");
  if (secretBtn) secretBtn.style.display = "none";

  // Buttons
  const yesBtn1 = document.getElementById("yesBtn1");
  const noBtn1 = document.getElementById("noBtn1");
  const nextBtn = document.getElementById("nextBtn");
  const yesBtn3 = document.getElementById("yesBtn3");
  const noBtn3 = document.getElementById("noBtn3");

  // Q1: YES -> go to Q2 (ONLY ONCE)
  if (yesBtn1) {
    yesBtn1.addEventListener("click", () => {
      disableAndHide(yesBtn1, noBtn1, secretBtn);
      showNextQuestion(2);
    });
  }

  // Q1: NO moves (only NO moves)
  if (noBtn1) {
    noBtn1.addEventListener("click", () => moveButton(noBtn1));
  }

  // Q2: Next -> Q3 (ONLY ONCE)
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextBtn.disabled = true;
      showNextQuestion(3);
    });
  }

  // Q3: YES -> celebration
  if (yesBtn3) {
    yesBtn3.addEventListener("click", () => {
      disableAndHide(yesBtn3, noBtn3);
      // If you have a celebrate() function elsewhere, call it.
      // Otherwise just show a celebration section:
      const celebration = document.getElementById("celebration");
      document.querySelectorAll(".question-section").forEach((q) => q.classList.add("hidden"));
      if (celebration) celebration.classList.remove("hidden");
    });
  }

  // Q3: NO moves
  if (noBtn3) {
    noBtn3.addEventListener("click", () => moveButton(noBtn3));
  }

  initLoveMeter();
  setupMusicPlayer();
});
