import { CONFIG } from "./config";
import { submitGuess } from "./core";

import type { GameState } from "../_types";

function addKeyToKeybaord(
  gameState: GameState,
  keyboard: HTMLElement,
  keyLabel: string,
  keyName: string,
  x = 1,
  y = 1
) {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = keyLabel;
  buttonElement.classList.add("key");
  buttonElement.addEventListener("click", () =>
    handleKeyPress(gameState, keyName)
  );
  if (x === 2) {
    buttonElement.style.gridColumn = `span ${x}`;
    buttonElement.style.width = `calc(var(--key-size) * ${x} + var(--keyboard-gap))`;
  } else if (x > 2) {
    buttonElement.style.gridColumn = `span ${x}`;
    buttonElement.style.width = `calc(var(--key-size) * ${x} + var(--keyboard-gap)) * ${
      x - 1
    }`;
  }
  if (y === 2) {
    buttonElement.style.gridRow = `span ${y}`;
    buttonElement.style.height = `calc(var(--key-size) * ${y} + var(--keyboard-gap))`;
  } else if (y > 2) {
    buttonElement.style.gridRow = `span ${y}`;
    buttonElement.style.height = `calc(var(--key-size) * ${y} + var(--keyboard-gap)) * ${
      y - 1
    }`;
  }
  if (keyName === "Enter") {
    buttonElement.style.fontSize = "var(--enter-key-font-size)";
  }
  keyboard.appendChild(buttonElement);
}

export function createKeyboard(gameState: GameState, keyboard: HTMLElement) {
  keyboard.innerHTML = "";
  const keyboardLayout =
    CONFIG.keyboardLayouts[gameState.settings.keyboardLayout];

  for (let key of keyboardLayout[0]) {
    addKeyToKeybaord(gameState, keyboard, key, key);
  }
  for (let key of keyboardLayout[1]) {
    addKeyToKeybaord(gameState, keyboard, key, key);
  }
  if (gameState.settings.keyboardLayout === "QWERTY") {
    addKeyToKeybaord(gameState, keyboard, "↵", "Enter", 1, 2);
  } else if (gameState.settings.keyboardLayout === "AZERTY") {
    addKeyToKeybaord(gameState, keyboard, "↵", "Enter", 2, 1);
  }
  for (let key of keyboardLayout[2]) {
    addKeyToKeybaord(gameState, keyboard, key, key);
  }
  addKeyToKeybaord(gameState, keyboard, "⌫", "Delete", 2, 1);
  if (gameState.settings.submitButtonType === "SUBMIT") {
    addKeyToKeybaord(gameState, keyboard, "SUBMIT", "Submit", 10, 1);
  }

  // Apply stored key colors
  for (let key in gameState.keyColors) {
    const keyElement = [...keyboard.children].find(
      (el) => el.textContent.toLowerCase() === key.toLowerCase()
    );
    if (keyElement) {
      keyElement.className = "key " + gameState.keyColors[key];
    }
  }
}

export function handleKeyPress(gameState: GameState, key: string) {
  if (gameState.gameOver) return;
  if (key === "Enter" || key === "Submit") {
    if (gameState.currentTile === CONFIG.wordLength) {
      submitGuess(gameState);
    }
  } else if (key === "Delete") {
    if (gameState.currentTile > 0) {
      gameState.currentTile--;
      const tiles = document.querySelectorAll(".tile");
      const currentTile =
        tiles[gameState.currentRow * CONFIG.wordLength + gameState.currentTile];
      currentTile.textContent = "";
      currentTile.classList.remove("pop");
      gameState.guesses[gameState.currentRow] = gameState.guesses[
        gameState.currentRow
      ].slice(0, -1);
    }
  } else if (gameState.currentTile < CONFIG.wordLength) {
    const tiles = document.querySelectorAll(".tile");
    const currentTile =
      tiles[gameState.currentRow * CONFIG.wordLength + gameState.currentTile];
    currentTile.textContent = key;
    currentTile.classList.add("pop");
    setTimeout(() => currentTile.classList.remove("pop"), 150);
    gameState.guesses[gameState.currentRow] =
      (gameState.guesses[gameState.currentRow] || "") + key;
    gameState.currentTile++;
  }
}
