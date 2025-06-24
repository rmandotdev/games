import { createKeyboard } from "./keyboard";

import type { GameState } from "../_types";

export function setTheme(
  gameState: GameState,
  theme: "dark" | "system" | "light"
) {
  gameState.settings.theme = theme;
  document.body.classList.remove("dark-mode");
  (
    document.getElementById("settings-container") as HTMLDivElement
  ).classList.remove("dark-mode");
  if (
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.body.classList.add("dark-mode");
    (
      document.getElementById("settings-container") as HTMLDivElement
    ).classList.add("dark-mode");
  }
}

export function initializeTheme(gameState: GameState) {
  const themeSelect = document.getElementById(
    "theme-select"
  ) as HTMLSelectElement;
  themeSelect.value = gameState.settings.theme;
  setTheme(gameState, gameState.settings.theme);
}

export function setKeyboardLayout(
  gameState: GameState,
  keyboardLayout: "QWERTY" | "AZERTY",
  keyboard: HTMLElement
) {
  gameState.settings.keyboardLayout = keyboardLayout;
  createKeyboard(gameState, keyboard);
}

export function initializeKeyboardLayout(gameState: GameState) {
  const keyboardLayoutSelect = document.getElementById(
    "keyboard-layout-select"
  ) as HTMLSelectElement;
  keyboardLayoutSelect.value = gameState.settings.keyboardLayout;
}

export function setSubmitButtonType(
  gameState: GameState,
  submitButtonType: string,
  keyboard: HTMLElement
) {
  gameState.settings.submitButtonType = submitButtonType;
  createKeyboard(gameState, keyboard);
}

export function initializeSubmitButtonType(gameState: GameState) {
  const submitButtonTypeSelect = document.getElementById(
    "submit-button-type-select"
  ) as HTMLSelectElement;
  submitButtonTypeSelect.value = gameState.settings.submitButtonType;
}
