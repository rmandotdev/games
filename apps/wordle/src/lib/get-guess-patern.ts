import type { TileColor } from "#types";

import { getTileColors } from "./get-tile-colors";

type PatternSymbol = "🟩" | "🟨" | "⬛";

const colorMap = {
  absent: "⬛",
  present: "🟨",
  correct: "🟩",
} as const satisfies Record<TileColor, PatternSymbol>;

function getGuessPattern(
  guesses: readonly string[],
  secretWord: string,
): string {
  const pattern: string[] = [];

  for (const guess of guesses) {
    const colors = getTileColors(guess, secretWord);
    const rowPattern: PatternSymbol[] = colors.map((color) => colorMap[color]);
    pattern.push(rowPattern.join(""));
  }

  return pattern.join("\n");
}

export { getGuessPattern };
