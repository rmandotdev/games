import { CONFIG } from "./config";
import { updateStats, renderStats } from "./statistics";
import { createKeyboard } from "./keyboard";

import type { GameState } from "../_types";

function getDailyWord() {
  const seed = 7855891;
  const today = new Date();
  const startDate = new Date("2025-01-01");
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return CONFIG.answers[(daysSinceStart * seed) % CONFIG.answers.length]!;
}

export function initializeGame(
  gameState: GameState,
  gameMode: "daily" | "unlimited" = "unlimited"
) {
  gameState.gameMode = gameMode;
  gameState.gameOver = false;
  gameState.currentRow = 0;
  gameState.currentTile = 0;
  gameState.guesses = [];
  gameState.keyColors = {};
  if (gameMode === "daily") {
    gameState.secretWord = getDailyWord();
    document.getElementById("new-game-button").textContent = "Play Unlimited";
  } else if (gameMode === "unlimited") {
    gameState.secretWord =
      CONFIG.answers[Math.floor(Math.random() * CONFIG.answers.length)];
    document.getElementById("new-game-button").textContent = "New Game";
  }
  createGameBoard();
  const keyboard = document.getElementById("keyboard");
  createKeyboard(gameState, keyboard);
  openSection(gameState, "game");
  document.getElementById("new-game-button").style.display = "none";
  keyboard.style.display = "grid";
}

function createGameBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  for (let i = 0; i < CONFIG.maxGuesses; i++) {
    for (let j = 0; j < CONFIG.wordLength; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      gameBoard.appendChild(tile);
    }
  }
}

/**
 * @param {GameState} gameState
 */
export function submitGuess(gameState: GameState) {
  const guess = gameState.guesses[gameState.currentRow].toLowerCase();
  if (!CONFIG.guesses.includes(guess)) {
    shakeRow(gameState);
    showNotification(`Word ${guess.toUpperCase()} does not exist`);
    return;
  }
  colorTiles(gameState);
  if (guess === gameState.secretWord) {
    finishGame(gameState, true);
  } else if (gameState.currentRow === CONFIG.maxGuesses - 1) {
    finishGame(gameState, false);
  } else {
    gameState.currentRow++;
    gameState.currentTile = 0;
  }
}

function shakeRow(gameState: GameState) {
  const tiles = document.querySelectorAll(".tile");
  const rowTiles = [...tiles].slice(
    gameState.currentRow * CONFIG.wordLength,
    (gameState.currentRow + 1) * CONFIG.wordLength
  );
  rowTiles.forEach((tile) => {
    tile.classList.add("shake");
    setTimeout(() => {
      tile.classList.remove("shake");
    }, 500);
  });
}

function getGuessPattern(gameState: GameState) {
  const pattern = [];
  for (let row = 0; row <= gameState.currentRow; row++) {
    const rowPattern = [];
    const guess = gameState.guesses[row]!.toLowerCase();
    const letterCounts = [...gameState.secretWord].reduce(
      (res: { [key: string]: number }, char) => (
        (res[char] = (res[char] || 0) + 1), res
      ),
      {}
    );
    for (let i = 0; i < CONFIG.wordLength; i++) {
      const letter = guess[i]!;
      if (letter === gameState.secretWord[i]) {
        rowPattern.push("🟩");
        letterCounts[letter]!--;
      } else if (letterCounts[letter]! > 0) {
        rowPattern.push("🟨");
        letterCounts[letter]!--;
      } else {
        rowPattern.push("⬛");
      }
    }
    pattern.push(rowPattern.join(""));
  }
  return pattern.join("\n");
}

function showSharePopup(gameState: GameState, isWin: boolean) {
  const pattern = getGuessPattern(gameState);

  const notification = document.createElement("div");
  notification.classList.add("notification", "game-over");

  const title = document.createElement("div");
  title.textContent = isWin
    ? "Congratulations!"
    : `Game Over! The word was ${gameState.secretWord.toUpperCase()}`;
  title.style.fontSize = "1.5rem";
  title.style.marginBottom = "15px";
  notification.appendChild(title);

  const patternDisplay = document.createElement("pre");
  patternDisplay.textContent = pattern;
  patternDisplay.style.fontFamily = "monospace";
  patternDisplay.style.margin = "15px 0";
  notification.appendChild(patternDisplay);

  const shareButton = document.createElement("button");
  shareButton.textContent = "Share";
  shareButton.classList.add("content-button");
  shareButton.style.margin = "10px 0";
  shareButton.addEventListener("click", () => {
    const shareText = `${
      isWin ? "I guessed" : "I did not guess"
    } a word in Wordle${
      isWin ? ` in ${gameState.currentRow + 1} attempts` : ""
    }\n\n${pattern}\n\nPlay on ${window.location.href}`;
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        showNotification("Copied to clipboard!");
      })
      .catch(() => {
        showNotification("Failed to copy to clipboard");
      });
  });

  notification.appendChild(shareButton);

  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.classList.add("notification-close");
  closeButton.addEventListener("click", () => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  });

  notification.appendChild(closeButton);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);
}

let notificationTimeout;

function showNotification(message: string) {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }
  }

  const notification = document.createElement("div");
  notification.textContent = message;
  notification.classList.add("notification");
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  notificationTimeout = setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
      notificationTimeout = null;
    }, 300);
  }, 2000);
}

function finishGame(gameState: GameState, won: boolean) {
  gameState.gameOver = true;
  document.getElementById("new-game-button").style.display = "block";
  document.getElementById("keyboard").style.display = "none";
  showSharePopup(gameState, won);
  updateStats(gameState, won);
  renderStats(gameState.stats);
  saveData(gameState);
}

function colorTiles(gameState: GameState) {
  const tiles = document.querySelectorAll(".tile");
  const guess = gameState.guesses[gameState.currentRow]!.toLowerCase();
  const rowTiles = [...tiles].slice(
    gameState.currentRow * CONFIG.wordLength,
    (gameState.currentRow + 1) * CONFIG.wordLength
  );

  const letterCounts = [...gameState.secretWord].reduce(
    (res, char) => ((res[char] = (res[char] || 0) + 1), res),
    {}
  );

  rowTiles.forEach((tile, index) => {
    const letter = guess[index]!;
    const correctLetter = gameState.secretWord[index];

    setTimeout(() => {
      tile.classList.add("flip");
      setTimeout(() => {
        if (letter === correctLetter) {
          tile.classList.add("correct");
          letterCounts[letter]--;
        } else if (letterCounts[letter] > 0) {
          tile.classList.add("present");
          letterCounts[letter]--;
        } else {
          tile.classList.add("absent");
        }
        setTimeout(() => {
          tile.classList.remove("flip");
        }, 250);
      }, 250);
    }, index * 250);
  });

  setTimeout(() => {
    rowTiles.forEach((tile, index) => {
      const letter = guess[index];
      const correctLetter = gameState.secretWord[index];

      if (letter !== correctLetter && letterCounts[letter] < 0) {
        tile.classList.remove("present");
        tile.classList.add("absent");
      }
    });

    const keys = document.querySelectorAll(".key");
    guess.split("").forEach((letter, index) => {
      const keyElement = [...keys].find(
        (key) => key.textContent.toLowerCase() === letter.toLowerCase()
      );
      if (letter === gameState.secretWord[index]) {
        keyElement.classList.add("correct");
        keyElement.classList.remove("present");
        gameState.keyColors[letter] = "correct";
      } else if (gameState.secretWord.includes(letter)) {
        if (!keyElement.classList.contains("correct")) {
          keyElement.classList.add("present");
          if (gameState.keyColors[letter] !== "correct") {
            gameState.keyColors[letter] = "present";
          }
        }
      } else {
        keyElement.classList.add("absent");
        if (!gameState.keyColors[letter]) {
          gameState.keyColors[letter] = "absent";
        }
      }
    });
  }, CONFIG.wordLength * 250 + 100);
}

export async function fetchWords(gameState: GameState) {
  try {
    const responseGuesses = await fetch(CONFIG.guessesListUrl);
    const responseAnswers = await fetch(CONFIG.answersListUrl);

    if (!responseGuesses.ok) {
      throw new Error("Network response for Guesses was not ok");
    }
    if (!responseAnswers.ok) {
      throw new Error("Network response for Answers was not ok");
    }

    const guesses = await responseGuesses.text();
    const answers = await responseAnswers.text();

    CONFIG.guesses = guesses.split("\n").map((word) => word.trim());
    CONFIG.answers = answers.split("\n").map((word) => word.trim());

    CONFIG.guesses = CONFIG.guesses.concat(CONFIG.answers);
  } catch (error) {
    console.error("Error fetching words:", error);
  }

  initializeGame(gameState, "daily");
}

function saveData(gameState: GameState) {
  localStorage.setItem("ww-wordle-stats", JSON.stringify(gameState.stats));
  localStorage.setItem(
    "ww-wordle-settings",
    JSON.stringify(gameState.settings)
  );
  localStorage.setItem(
    "ww-wordle-daily",
    JSON.stringify(gameState.dailyPlayedLast)
  );
}

export function loadData(gameState: GameState) {
  const savedStats = localStorage.getItem("ww-wordle-stats");
  if (savedStats) {
    gameState.stats = JSON.parse(savedStats);
    renderStats(gameState.stats);
  }
  const savedSettings = localStorage.getItem("ww-wordle-settings");
  if (savedSettings) {
    gameState.settings = JSON.parse(savedSettings);
  }
  const dailyPlayedLast = localStorage.getItem("ww-wordle-daily");
  if (dailyPlayedLast) {
    gameState.dailyPlayedLast = JSON.parse(dailyPlayedLast);
  }
}

export function openSection(gameState: GameState, sectionName: string) {
  document.querySelectorAll(".content-container").forEach((container) => {
    if (container.id === `${sectionName}-container`) {
      container.classList.remove("hidden");
    } else {
      container.classList.add("hidden");
    }
  });
  gameState.currentSection = sectionName;
  if (sectionName === "stats") {
    renderStats(gameState.stats);
  }
}
