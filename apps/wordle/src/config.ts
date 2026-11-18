import answersRaw from "./data/answers.txt?raw";
import guessesRaw from "./data/guesses.txt?raw";

function parseWords(raw: string): string[] {
  return raw
    .split("\n")
    .map((word) => word.trim())
    .filter(Boolean);
}

const answers = parseWords(answersRaw);

export const WORDS = {
  guesses: new Set(parseWords(guessesRaw).concat(answers)),
  answers,

  answersRaw,
  guessesRaw,
};

export const CONFIG = {
  maxGuesses: 6,
  wordLength: 5,

  seed: 7855891,

  keyboardLayouts: {
    QWERTY: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
    AZERTY: ["AZERTYUIOP", "QSDFGHJKLM", "WXCVBN"],
  },

  gameUrl: "https://wordle.rman.dev/",
} as const;
