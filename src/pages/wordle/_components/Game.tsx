import { onMount } from "solid-js";

import {
  fetchWords,
  openSection,
  loadData,
  initializeGame,
} from "../_scripts/core";
import { handleKeyPress } from "../_scripts/keyboard";
import {
  setTheme,
  initializeTheme,
  setKeyboardLayout,
  initializeKeyboardLayout,
  setSubmitButtonType,
  initializeSubmitButtonType,
} from "../_scripts/settings";

import type { GameState } from "../_types";

function App() {
  const gameState = {
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
  } as GameState;

  onMount(() => {
    initializeTheme(gameState);
    initializeKeyboardLayout(gameState);
    initializeSubmitButtonType(gameState);

    // Settings event listeners
    document
      .getElementById("theme-select")
      .addEventListener("change", (event) => {
        setTheme(gameState, event.target.value);
        saveData();
      });

    const keyboard = document.getElementById("keyboard") as HTMLDivElement;

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
      .addEventListener("change", () => {
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
    document
      .getElementById("leaderboard-button")
      .addEventListener("click", () => {
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
  });

  return (
    <div id="main-container">
      <div id="top-bar">
        <div class="top-bar-buttons-div">
          <button id="menu-button" class="top-bar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <button id="leaderboard-button" class="top-bar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 14V17M12 14C9.58104 14 7.56329 12.2822 7.10002 10M12 14C14.419 14 16.4367 12.2822 16.9 10M17 5H19.75C19.9823 5 20.0985 5 20.1951 5.01921C20.5918 5.09812 20.9019 5.40822 20.9808 5.80491C21 5.90151 21 6.01767 21 6.25C21 6.94698 21 7.29547 20.9424 7.58527C20.7056 8.77534 19.7753 9.70564 18.5853 9.94236C18.2955 10 17.947 10 17.25 10H17H16.9M7 5H4.25C4.01767 5 3.90151 5 3.80491 5.01921C3.40822 5.09812 3.09812 5.40822 3.01921 5.80491C3 5.90151 3 6.01767 3 6.25C3 6.94698 3 7.29547 3.05764 7.58527C3.29436 8.77534 4.22466 9.70564 5.41473 9.94236C5.70453 10 6.05302 10 6.75 10H7H7.10002M12 17C12.93 17 13.395 17 13.7765 17.1022C14.8117 17.3796 15.6204 18.1883 15.8978 19.2235C16 19.605 16 20.07 16 21H8C8 20.07 8 19.605 8.10222 19.2235C8.37962 18.1883 9.18827 17.3796 10.2235 17.1022C10.605 17 11.07 17 12 17ZM7.10002 10C7.03443 9.67689 7 9.34247 7 9V4.57143C7 4.03831 7 3.77176 7.09903 3.56612C7.19732 3.36201 7.36201 3.19732 7.56612 3.09903C7.77176 3 8.03831 3 8.57143 3H15.4286C15.9617 3 16.2282 3 16.4339 3.09903C16.638 3.19732 16.8027 3.36201 16.901 3.56612C17 3.77176 17 4.03831 17 4.57143V9C17 9.34247 16.9656 9.67689 16.9 10"></path>
            </svg>
          </button>
        </div>
        <h1 id="game-title">Wordle</h1>
        <div class="top-bar-buttons-div">
          <button id="stats-button" class="top-bar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </button>
          <button id="settings-button" class="top-bar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div id="menu-container" class="content-container hidden">
        <button id="play-daily" class="content-button">
          Play Daily
        </button>
        <button id="play-unlimited" class="content-button">
          Play Unlimited
        </button>
      </div>
      <div id="game-container" class="content-container">
        <div id="game-board"></div>
        <div id="keyboard"></div>
        <button id="new-game-button" class="content-button">
          New Game
        </button>
      </div>
      <div id="stats-container" class="content-container hidden">
        <div id="stats-grid">
          <div class="stat-box">
            <div class="stat-number" id="games-played">
              0
            </div>
            <div class="stat-label">Played</div>
          </div>
          <div class="stat-box">
            <div class="stat-number" id="win-percentage">
              0%
            </div>
            <div class="stat-label">Win %</div>
          </div>
          <div class="stat-box">
            <div class="stat-number" id="current-streak">
              0
            </div>
            <div class="stat-label">Current Streak</div>
          </div>
          <div class="stat-box">
            <div class="stat-number" id="max-streak">
              0
            </div>
            <div class="stat-label">Max Streak</div>
          </div>
        </div>
        <h3 id="guess-distribution-title">Guess Distribution</h3>
        <div id="guess-distribution"></div>
      </div>
      <div id="leaderboard-container" class="content-container hidden">
        <h2>Leaderboard</h2>
        <div id="leaderboard-list"></div>
      </div>
      <div id="settings-container" class="content-container hidden">
        <div class="setting-group">
          <label for="theme-select" class="setting-label">
            Theme
          </label>
          <select id="theme-select" class="setting-select">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system" selected>
              System
            </option>
          </select>
        </div>
        <div class="setting-group">
          <label for="keyboard-layout-select" class="setting-label">
            Keyboard Type
          </label>
          <select id="keyboard-layout-select" class="setting-select">
            <option value="QWERTY">QWERTY</option>
            <option value="AZERTY">AZERTY</option>
          </select>
        </div>
        <div class="setting-group">
          <label for="submit-button-type-select" class="setting-label">
            Submit Button Type
          </label>
          <select id="submit-button-type-select" class="setting-select">
            <option value="ENTER">ENTER</option>
            <option value="SUBMIT">SUBMIT</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
