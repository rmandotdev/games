import type { GameState, GameStateStats } from "../_types";

export function updateStats(gameState: GameState, won: boolean) {
  gameState.stats.gamesPlayed++;
  if (won) {
    gameState.stats.gamesWon++;
    gameState.stats.currentStreak++;
    gameState.stats.maxStreak = Math.max(
      gameState.stats.maxStreak,
      gameState.stats.currentStreak
    );
    gameState.stats.guessDistribution[gameState.currentRow]!++;
  } else {
    gameState.stats.currentStreak = 0;
  }
}

export function renderStats(stats: GameStateStats) {
  document.getElementById("games-played").textContent = stats.gamesPlayed;
  document.getElementById("win-percentage").textContent =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) + "%"
      : "0%";
  document.getElementById("current-streak").textContent = stats.currentStreak;
  document.getElementById("max-streak").textContent = stats.maxStreak;
  const guessDistribution = document.getElementById(
    "guess-distribution"
  ) as HTMLElement;
  guessDistribution.innerHTML = "";
  const maxGuesses = Math.max(...stats.guessDistribution, 1);
  for (let i = 0; i < stats.guessDistribution.length; i++) {
    const row = document.createElement("div");
    row.className = "guess-row";
    const label = document.createElement("div");
    label.className = "guess-label";
    label.textContent = `${i + 1}`;
    const bar = document.createElement("div");
    bar.className = "guess-bar";
    const barFill = document.createElement("div");
    barFill.className = "guess-bar-fill";
    const percentage = (stats.guessDistribution[i]! / maxGuesses) * 100;
    barFill.style.width = `${percentage}%`;
    const count = document.createElement("div");
    count.className = "guess-count";
    count.textContent = `${stats.guessDistribution[i]}`;
    bar.appendChild(barFill);
    bar.appendChild(count);
    row.appendChild(label);
    row.appendChild(bar);
    guessDistribution.appendChild(row);
  }
}
