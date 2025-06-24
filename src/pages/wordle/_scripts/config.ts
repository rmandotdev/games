export const CONFIG = {
  maxGuesses: 6 as const, // Maximum number of guesses allowed
  wordLength: 5 as const, // Length of the word to guess
  guessesListUrl: "/data/guesses.txt" as const,
  answersListUrl: "/data/answers.txt" as const,
  keyboardLayouts: {
    QWERTY: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
    AZERTY: ["AZERTYUIOP", "QSDFGHJKLM", "WXCVBN"],
  } as const,
  guesses: [""],
  answers: [""],
};
