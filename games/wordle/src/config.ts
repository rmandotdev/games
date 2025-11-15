export const WORDS = {
  guesses: [] as string[],
  answers: [] as string[],
};

export const CONFIG = {
  maxGuesses: 6,
  wordLength: 5,

  seed: 7855891,

  keyboardLayouts: {
    QWERTY: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
    AZERTY: ["AZERTYUIOP", "QSDFGHJKLM", "WXCVBN"],
  },

  dataUrls: {
    guesses: "/data/guesses.txt",
    answers: "/data/answers.txt",
  },
} as const;
