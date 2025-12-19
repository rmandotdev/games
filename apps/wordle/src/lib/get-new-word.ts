import { WORDS, CONFIG } from "~/config";
import type { GameMode } from "~/types";

function getRandomWord(): string {
  const randomIndex = Math.floor(Math.random() * WORDS.answers.length);
  const randomWord = WORDS.answers[randomIndex]!;
  return randomWord;
}

function getDailyWord(): string {
  const seed = CONFIG.seed;
  const today = new Date();
  const startDate = new Date("2025-01-01");
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return WORDS.answers[(daysSinceStart * seed) % WORDS.answers.length]!;
}

export function getNewWord(gameMode: GameMode): string {
  const newWord = gameMode === "daily" ? getDailyWord() : getRandomWord();
  return newWord;
}
