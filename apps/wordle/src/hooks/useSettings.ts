import { createLocalStorageSignal } from "~/lib/create-local-storage-signal";

import type { Settings } from "~/types";

const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  keyboardLayout: "QWERTY",
  submitButtonType: "ENTER",
};

const STORAGE_WORDLE_SETTINGS_KEY = "wordle-settings";

export function useSettings() {
  const [getSettings, setSettings] = createLocalStorageSignal<Settings>(
    STORAGE_WORDLE_SETTINGS_KEY,
    DEFAULT_SETTINGS
  );

  function updateThemeState() {
    const theme = getSettings().theme;
    const isSystemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = theme === "dark" || (theme === "system" && isSystemDark);

    if (isDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  function updateSettings(settings: Partial<Settings>) {
    setSettings((prev) => ({ ...prev, ...settings }));
    updateThemeState();
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", updateThemeState);

  updateThemeState();

  return { getSettings, updateSettings };
}
