// !@ts-nocheck

import { fetchWords, openSection, loadData, initializeGame } from "./core.js";
import { handleKeyPress } from "./keyboard.js";
import {
  setTheme,
  initializeTheme,
  setKeyboardLayout,
  initializeKeyboardLayout,
  setSubmitButtonType,
  initializeSubmitButtonType,
} from "./settings.js";

/**
 * @type {GameState}
 */
let gameState = {
  currentRow: 0,
  currentTile: 0,
  gameOver: false,
  secretWord: "",
  guesses: [],
  currentSection: "game",
  dailyPlayedLast: null,
  settings: {
    theme: "system",
    keyboardLayout: "QWERTY",
    submitButtonType: "ENTER",
  },
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  },
  keyColors: {},
  gameMode: null,
};

initializeTheme(gameState);
initializeKeyboardLayout(gameState);
initializeSubmitButtonType(gameState);

// Settings event listeners
document.getElementById("theme-select").addEventListener("change", (event) => {
  setTheme(gameState, event.target.value);
  saveData();
});

const keyboard = document.getElementById("keyboard");

document
  .getElementById("keyboard-layout-select")
  .addEventListener("change", (event) => {
    setKeyboardLayout(gameState, event.target.value, keyboard);
    saveData();
  });

document
  .getElementById("submit-button-type-select")
  .addEventListener("change", (event) => {
    setSubmitButtonType(gameState, event.target.value, keyboard);
    saveData();
  });

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    if (gameState.settings.theme === "system") {
      setTheme(gameState, "system");
    }
  });

// Top bar
document.getElementById("menu-button").addEventListener("click", () => {
  if (gameState.currentSection !== "menu") {
    openSection(gameState, "menu");
  } else {
    openSection(gameState, "game");
  }
});
document.getElementById("leaderboard-button").addEventListener("click", () => {
  if (gameState.currentSection !== "leaderboard") {
    openSection(gameState, "leaderboard");
  } else {
    openSection(gameState, "game");
  }
});
document.getElementById("stats-button").addEventListener("click", () => {
  if (gameState.currentSection !== "stats") {
    openSection(gameState, "stats");
  } else {
    openSection(gameState, "game");
  }
});
document.getElementById("settings-button").addEventListener("click", () => {
  if (gameState.currentSection !== "settings") {
    openSection(gameState, "settings");
  } else {
    openSection(gameState, "game");
  }
});

// Menu
document
  .getElementById("play-daily")
  .addEventListener("click", () => initializeGame(gameState, "daily"));
document
  .getElementById("play-unlimited")
  .addEventListener("click", () => initializeGame(gameState, "unlimited"));
document
  .getElementById("new-game-button")
  .addEventListener("click", () => initializeGame(gameState, "unlimited"));

fetchWords(gameState);
loadData(gameState);
openSection(gameState, "game");

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleKeyPress(gameState, "Enter");
  } else if (event.key === "Backspace") {
    handleKeyPress(gameState, "Delete");
  } else if (event.key.match(/^[a-zA-Z]$/)) {
    handleKeyPress(gameState, event.key.toUpperCase());
  }
});

console;
