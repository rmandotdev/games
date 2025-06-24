export type GameStateSettings = {
  theme: "dark" | "system" | "light";
  keyboardLayout: "QWERTY" | "AZERTY";
  submitButtonType: string;
};

export type GameStateStats = {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
};

export type GameState = {
  gameMode: "daily" | "unlimited" | null;
  currentRow: number;
  currentTile: number;
  gameOver: boolean;
  secretWord: string;
  guesses: string[];
  currentSection: string;
  dailyPlayedLast: null | number;
  settings: GameStateSettings;
  stats: GameStateStats;
  keyColors: { [key: string]: unknown };
};
