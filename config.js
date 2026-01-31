// ============================================ 
// 💝 CUSTOMIZE YOUR VALENTINE'S WEBSITE HERE 💝
// ============================================

const CONFIG = {
  valentineName: "Aayushi",

  pageTitle: "Will You Be My Valentine? ❤️",

  floatingEmojis: {
    hearts: ['❤️', '💖', '💝', '💗', '💓'],
    bears: ['🧸']
  },

  questions: {
    first: {
      text: "Do you like me?",
      yesBtn: "Yes",
      noBtn: "No",
      
    },
    second: {
      text: "How much? i need to comform before making this gesture, personal reason😂",
      startText: "This much!",
      nextBtn: "Next ❤️"
    },
    third: {
      text: "Will you be my Valentine...?",
      yesBtn: "Yes!!!!",
      noBtn: "No 👎"
    }
  },

  loveMessages: {
    extreme: "WOOOOH!! You love me that much?!! didnt expect that...jk 😂❤️😘",
    high: "To infinity and beyond!! ❤️",
    normal: "And beyond! 🥰"
  },

  celebration: {
    title: "Yay! I'm the luckiest person..., or maybe you are 😘",
    message: "Now my turn..., i say yes too 🥳❤️ (at this point idk if you said yes or no, but suck it up 😁)",
    emojis: "💖💝❤️"
  },

  colors: {
    backgroundStart: "#ffafbd",
    backgroundEnd: "#ffc3a0",
    buttonBackground: "#ff6b6b",
    buttonHover: "#ff8787",
    textColor: "#ff4757"
  },

  animations: {
    floatDuration: "10s",
    floatDistance: "50px",
    bounceSpeed: "0.4s",
    heartExplosionSize: 1.5
  },

  music: {
    enabled: true,
    autoplay: false,
    musicUrl: "https://res.cloudinary.com/dpevtua87/video/upload/v1769852231/music_3_zcbim2.mp3",
    startText: "🎵 Play Music",
    stopText: "🔇 Stop Music",
    volume: 0.5
  }
};

// Don't modify below
window.VALENTINE_CONFIG = CONFIG;
