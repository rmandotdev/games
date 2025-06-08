export const CONFIG = {
  maxGuesses: 6, // Maximum number of guesses allowed
  wordLength: 5, // Length of the word to guess
  guessesListUrl: "./data/guesses.txt",
  answersListUrl: "./data/answers.txt",
  keyboardLayouts: {
    QWERTY: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
    AZERTY: ["AZERTYUIOP", "QSDFGHJKLM", "WXCVBN"],
  },
  guesses: [""],
  answers: [""],
};
