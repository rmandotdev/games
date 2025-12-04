// #region State

export type State = "loading" | "playing" | "gameover";
export type GameMode = "daily" | "unlimited";

export type CurrentSection =
  | "game"
  | "menu"
  | "settings"
  | "stats"
  | "leaderboard";

// #endregion

// #region Settings

export type Theme = "dark" | "system" | "light";
export type KeyboardLayout = "QWERTY" | "AZERTY";
export type SubmitButtonType = "ENTER" | "SUBMIT";

export type Settings = {
  theme: Theme;
  keyboardLayout: KeyboardLayout;
  submitButtonType: SubmitButtonType;
};

// #endregion

// #region Stats

export type Stats = {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
};

// #endregion

// #region Keyboard
export type BoardAction =
  | { type: "SUBMIT-GUESS" }
  | { type: "DELETE-LETTER" }
  | { type: "INPUT-LETTER"; data: string };
export type KeyName = "Enter" | "Submit" | "Delete" | (string & {});
export type KeyColor = "correct" | "present" | "absent";
export type KeyColorOrNotColored = KeyColor | "";

// #endregion

// #region Board tiles

export type TileColor = KeyColor & {};
export type TileColorOrEmpty = TileColor | "";
export type TileAnim = "flip" | "shake" | "pop" | "";

export type TileInfo = {
  letter: string;
  color: TileColorOrEmpty;
  anim: TileAnim;
};

// #endregion
