import { createLocalStorageSignal } from "~/lib/create-local-storage-signal";
import type { Stats } from "~/types";

const EMPTY_STATS_STATE: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

const STORAGE_WORDLE_STATS_KEY = "wordle-stats";

export function useStats() {
  const [getStats, setStats] = createLocalStorageSignal<Stats>(
    STORAGE_WORDLE_STATS_KEY,
    EMPTY_STATS_STATE,
  );

  function updateStats(isWin: boolean, currentRow: number) {
    const stats = getStats();
    const gamesPlayed = stats.gamesPlayed + 1;

    if (!isWin) {
      setStats({ ...stats, gamesPlayed, currentStreak: 0 });
      return;
    }

    const currentStreak = stats.currentStreak + 1;
    const maxStreak = Math.max(stats.maxStreak, currentStreak);
    const guessDistribution = window.structuredClone(stats.guessDistribution);
    guessDistribution[currentRow]!++;

    setStats({
      ...stats,
      gamesPlayed,
      gamesWon: stats.gamesWon + 1,
      currentStreak,
      maxStreak,
      guessDistribution,
    });
  }

  return { getStats, updateStats };
}
