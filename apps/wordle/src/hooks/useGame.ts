import { batch, createSignal } from "solid-js";
import { CONFIG, WORDS } from "~/config";
import { getNewWord } from "~/lib/get-new-word";
import { getTileColors } from "~/lib/get-tile-colors";
import { showNotification } from "~/lib/show-notification";
import { showSharePopup } from "~/lib/show-share-popup";
import type {
  BoardAction,
  CurrentSection,
  GameMode,
  KeyColor,
  State,
  TileColor,
} from "~/types";

import { useSettings } from "./useSettings";
import { useStats } from "./useStats";
import { useTiles } from "./useTiles";

export function useGame() {
  const [getState, setState] = createSignal<State>("loading");

  const { getSettings, updateSettings } = useSettings();
  const { getStats, updateStats } = useStats();

  const [currentSection, setCurrentSection] =
    createSignal<CurrentSection>("game");

  const [getSecretWord, setSecretWord] = createSignal<string>("");

  const [getGuesses, setGuesses] = createSignal<string[]>([]);

  const [getKeyColors, setKeycolors] = createSignal<Record<string, KeyColor>>(
    {},
  );

  const {
    getTiles,
    setTiles,
    resetTiles,
    flipTile,
    shakeCurrentRow,
    popTile,
    getCurrentRow,
    setCurrentRow,
    getCurrentTile,
    setCurrentTile,
  } = useTiles();

  function finishGame(isWin: boolean) {
    setState("gameover");
    updateStats(isWin, getCurrentRow());
    showSharePopup({
      isWin,
      guesses: getGuesses(),
      secretWord: getSecretWord(),
    });
  }

  const DELAY_BETWEEN_FLIPS = 175;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function colorTilesAndKeys() {
    const row = getCurrentRow();
    const guess = getGuesses()[row]!.toLowerCase();
    const tileColors = getTileColors(guess, getSecretWord());

    const newKeyColors: Record<string, KeyColor> = {};
    const flipPromises: Promise<void>[] = [];

    for (let index = 0; index < guess.length; index++) {
      const flipPromise = (async () => {
        await delay(index * DELAY_BETWEEN_FLIPS);

        const tileIndex = row * CONFIG.wordLength + index;
        const color: TileColor = tileColors[index]!;
        await flipTile(tileIndex, color);

        const letter = guess[index]!;
        const upper = letter.toUpperCase();
        const existing = newKeyColors[upper] || "";

        const newKeyColor: KeyColor = (() => {
          if (existing === "correct") return "correct";
          if (existing === "present" && color === "absent") return "present";
          return color;
        })();

        newKeyColors[upper] = newKeyColor;
      })();

      flipPromises.push(flipPromise);
    }

    await Promise.all(flipPromises);

    setKeycolors((prev) => ({ ...prev, ...newKeyColors }));
  }

  async function submitGuess(guess: string) {
    if (!WORDS.guesses.includes(guess)) {
      await shakeCurrentRow();
      showNotification(`Word ${guess.toUpperCase()} does not exist`);
      return;
    }

    colorTilesAndKeys();

    if (guess === getSecretWord()) {
      finishGame(true);
    } else if (getCurrentRow() === CONFIG.maxGuesses - 1) {
      finishGame(false);
    } else {
      setCurrentRow(getCurrentRow() + 1);
      setCurrentTile(0);
    }
  }

  function startNewGame(gamemode: GameMode = "unlimited") {
    batch(() => {
      setState("playing");

      setCurrentRow(0);
      setCurrentTile(0);

      resetTiles();

      setGuesses([]);
      setKeycolors({});

      setSecretWord(getNewWord(gamemode));
      setCurrentSection("game");
    });
  }

  async function fetchWords() {
    try {
      const [guessesString, answersString] = await Promise.all([
        fetch(CONFIG.dataUrls.guesses).then((r) => r.text()),
        fetch(CONFIG.dataUrls.answers).then((r) => r.text()),
      ]);

      const guesses = guessesString.split("\n").map((word) => word.trim());
      const answers = answersString.split("\n").map((word) => word.trim());

      WORDS.guesses = guesses.concat(answers);
      WORDS.answers = answers;
    } catch (error) {
      console.error("Error fetching words:", error);
    }

    return WORDS;
  }

  function handleBoardAction(action: BoardAction) {
    if (getState() !== "playing") return;

    const currentTile = getCurrentTile();
    const currentRow = getCurrentRow();

    if (action.type === "SUBMIT-GUESS") {
      if (currentTile !== CONFIG.wordLength) return;
      const guess = getGuesses()[currentRow]!.toLowerCase();
      submitGuess(guess);
      return;
    }

    if (action.type === "DELETE-LETTER") {
      if (currentTile === 0) return;

      const tileIndex = currentRow * CONFIG.wordLength + (currentTile - 1);

      setTiles((prev) => {
        const copy = [...prev];
        copy[tileIndex] = { ...copy[tileIndex]!, letter: "", anim: "" };
        return copy;
      });

      const guesses = window.structuredClone(getGuesses());
      guesses[currentRow] = guesses[currentRow]!.slice(0, -1);
      setGuesses(guesses);

      setCurrentTile(currentTile - 1);
      return;
    }

    if (action.type === "INPUT-LETTER") {
      if (currentTile >= CONFIG.wordLength) return;

      const letter = action.data.toUpperCase();
      const tileIndex = currentRow * CONFIG.wordLength + currentTile;

      popTile(tileIndex, letter);

      const guesses = window.structuredClone(getGuesses());
      const currentRowInput = guesses[currentRow] || "";
      guesses[currentRow] = `${currentRowInput}${letter}`;
      setGuesses(guesses);

      setCurrentTile(currentTile + 1);
      return;
    }
  }

  function getBoardAction(event: KeyboardEvent): BoardAction | null {
    const key = event.key;
    if (key === "Enter") {
      return { type: "SUBMIT-GUESS" };
    }
    if (key === "Backspace") {
      return { type: "DELETE-LETTER" };
    }
    if (key.match(/^[a-zA-Z]$/)) {
      handleBoardAction({ type: "INPUT-LETTER", data: key });
    }
    return null;
  }

  function init() {
    fetchWords().then(() => startNewGame("daily"));
    document.addEventListener("keydown", (event) => {
      const action = getBoardAction(event);
      if (!action) return;
      handleBoardAction(action);
    });
  }

  return {
    getState,

    currentSection,
    setCurrentSection,

    getStats,

    getSettings,
    updateSettings,

    getTiles,
    getKeyColors,

    startNewGame,

    handleBoardAction,

    init,
  };
}
