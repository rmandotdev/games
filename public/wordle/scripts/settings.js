import { createKeyboard } from "./keyboard.js";

/**
 * @param {GameState} gameState
 */
export function setTheme(gameState, theme) {
  gameState.settings.theme = theme;
  document.body.classList.remove("dark-mode");
  document.getElementById("settings-container").classList.remove("dark-mode");
  if (
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.body.classList.add("dark-mode");
    document.getElementById("settings-container").classList.add("dark-mode");
  }
}

/**
 * @param {GameState} gameState
 */
export function initializeTheme(gameState) {
  const themeSelect = document.getElementById("theme-select");
  themeSelect.value = gameState.settings.theme;
  setTheme(gameState, gameState.settings.theme);
}

/**
 * @param {GameState} gameState
 * @param {"QWERTY" | "AZERTY"} keyboardLayout
 * @param {HTMLElement} keyboard
 */
export function setKeyboardLayout(gameState, keyboardLayout, keyboard) {
  gameState.settings.keyboardLayout = keyboardLayout;
  createKeyboard(gameState, keyboard);
}

/**
 * @param {GameState} gameState
 */
export function initializeKeyboardLayout(gameState) {
  const keyboardLayoutSelect = document.getElementById(
    "keyboard-layout-select"
  );
  keyboardLayoutSelect.value = gameState.settings.keyboardLayout;
}

/**
 * @param {GameState} gameState
 * @param {string} submitButtonType
 * @param {HTMLElement} keyboard
 */
export function setSubmitButtonType(gameState, submitButtonType, keyboard) {
  gameState.settings.submitButtonType = submitButtonType;
  createKeyboard(gameState, keyboard);
}

/**
 * @param {GameState} gameState
 */
export function initializeSubmitButtonType(gameState) {
  const submitButtonTypeSelect = document.getElementById(
    "submit-button-type-select"
  );
  submitButtonTypeSelect.value = gameState.settings.submitButtonType;
}
