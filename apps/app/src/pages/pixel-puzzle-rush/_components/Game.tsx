import { createSignal, onMount, For, Show } from "solid-js";

import type { CurrentState } from "../_types";

import Controls from "./Controls";
import Settings from "./Settings";

function App() {
  const CONFIG = {
    baseColors: [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ffa500",
    ],
  } as const;

  type GameState = {
    gridSize: number;
    pattern: string[];
    grid: string[];
    bestTimes: Record<string, number>;
    startTime: number;
    currentTime: number;
    pausedTime: number;
    colors: string[];
    timerInterval: number | NodeJS.Timeout | undefined;
    currentState: CurrentState;
  };

  const [gameState, setGameState] = createSignal<GameState>({
    gridSize: 4,
    pattern: [],
    grid: [],
    bestTimes: {},
    startTime: 0,
    currentTime: 0,
    pausedTime: 0,
    colors: [],
    timerInterval: undefined,
    currentState: "menu",
  });

  const [message, setMessage] = createSignal("");
  const [gridSizeInput, setGridSizeInput] = createSignal("4");
  const [colorCountInput, setColorCountInput] = createSignal("4");

  function saveData() {
    localStorage.setItem(
      "pixel-puzzle-rush-data",
      JSON.stringify({ bestTimes: gameState().bestTimes }),
    );
  }

  function loadData() {
    const data = JSON.parse(
      localStorage.getItem("pixel-puzzle-rush-data") ?? "{}",
    );
    setGameState((prev) => ({ ...prev, bestTimes: data?.bestTimes ?? {} }));
  }

  function initializeGame() {
    const pattern = generateRandomGrid();
    const grid = generateRandomGrid();
    setGameState((prev) => ({ ...prev, pattern, grid }));
  }

  function updateGameConfig() {
    const gridSize = parseInt(gridSizeInput());
    const colorCount = parseInt(colorCountInput());
    const colors = generateColors(colorCount);
    setGameState((prev) => ({ ...prev, gridSize, colors }));
  }

  function generateColors(count: number) {
    return CONFIG.baseColors.slice(0, count);
  }

  function generateRandomGrid() {
    const state = gameState();
    return Array.from(
      { length: state.gridSize * state.gridSize },
      () => state.colors[Math.floor(Math.random() * state.colors.length)]!,
    );
  }

  function getBestTimeText() {
    const state = gameState();
    const key = `${state.gridSize}x${state.gridSize}-${state.colors.length}`;
    const bestTime = state.bestTimes[key] || Infinity;
    return bestTime === Infinity
      ? `Best Time (${key}): None`
      : `Best Time (${key}): ${(bestTime / 1000).toFixed(2)}s`;
  }

  function startTimer() {
    const interval = setInterval(() => {
      const state = gameState();
      if (state.currentState !== "playing") return;
      const currentTime = Date.now() - state.startTime;
      setGameState((prev) => ({ ...prev, currentTime }));
    }, 10);
    setGameState((prev) => ({ ...prev, timerInterval: interval }));
  }

  function checkMatch() {
    const state = gameState();
    if (state.grid.every((color, index) => color === state.pattern[index])) {
      endGame();
    }
  }

  function startGame() {
    updateGameConfig();
    setGameState((prev) => ({
      ...prev,
      currentState: "playing",
      startTime: Date.now() - prev.pausedTime,
      currentTime: prev.pausedTime,
      pausedTime: 0,
    }));
    initializeGame();
    startTimer();
    setMessage("");
  }

  function pauseGame() {
    const state = gameState();
    if (state.currentState === "paused") {
      setGameState((prev) => ({
        ...prev,
        currentState: "playing",
        startTime: Date.now() - prev.currentTime,
      }));
      startTimer();
    } else if (state.currentState === "playing") {
      clearInterval(state.timerInterval);
      setGameState((prev) => ({
        ...prev,
        currentState: "paused",
        pausedTime: prev.currentTime,
      }));
    }
  }

  function cancelGame() {
    clearInterval(gameState().timerInterval);
    setGameState((prev) => ({
      ...prev,
      currentState: "menu",
      pausedTime: 0,
    }));
    setMessage("");
  }

  function endGame() {
    const state = gameState();
    clearInterval(state.timerInterval);
    const key = `${state.gridSize}x${state.gridSize}-${state.colors.length}`;
    if (!state.bestTimes[key] || state.currentTime < state.bestTimes[key]) {
      setGameState((prev) => ({
        ...prev,
        bestTimes: { ...prev.bestTimes, [key]: state.currentTime },
      }));
      saveData();
      setMessage(
        `New Best Time for ${key}: ${(state.currentTime / 1000).toFixed(2)}s!`,
      );
    } else {
      setMessage(
        `Puzzle Solved! Time: ${(state.currentTime / 1000).toFixed(2)}s`,
      );
    }
    setGameState((prev) => ({
      ...prev,
      currentState: "finished",
      pausedTime: 0,
    }));
  }

  function showMenu() {
    clearInterval(gameState().timerInterval);
    setGameState((prev) => ({
      ...prev,
      currentState: "menu",
      pausedTime: 0,
    }));
    setMessage("");
  }

  function handleGridClick(index: number) {
    const state = gameState();
    if (state.currentState !== "playing") return;
    const nextColorIndex =
      (state.colors.indexOf(state.grid[index]!) + 1) % state.colors.length;
    const newGrid = [...state.grid];
    newGrid[index] = state.colors[nextColorIndex]!;
    setGameState((prev) => ({ ...prev, grid: newGrid }));
    checkMatch();
  }

  onMount(() => {
    loadData();
    updateGameConfig();
    return () => clearInterval(gameState().timerInterval);
  });

  return (
    <div id="game-container">
      <h1 class="no-select">Pixel Puzzle Rush</h1>

      <Settings
        currentState={gameState().currentState}
        gridSizeInput={gridSizeInput()}
        setGridSizeInput={setGridSizeInput}
        colorCountInput={colorCountInput()}
        setColorCountInput={setColorCountInput}
      />

      <Show when={gameState().currentState !== "menu"}>
        <div id="timer">
          Time: {(gameState().currentTime / 1000).toFixed(2)}s
        </div>
        <div id="best-time">{getBestTimeText()}</div>
      </Show>

      <Show when={gameState().currentState !== "menu"}>
        <div
          class="no-select"
          style={{
            visibility:
              gameState().currentState === "paused" ? "hidden" : "visible",
          }}
        >
          <div
            id="pattern"
            class="no-select"
            style={{
              "grid-template-columns": `repeat(${gameState().gridSize}, 1fr)`,
            }}
          >
            <For each={gameState().pattern}>
              {(color) => (
                <div class="pixel" style={{ "background-color": color }}></div>
              )}
            </For>
          </div>

          <div
            id="grid"
            class="no-select"
            style={{
              "grid-template-columns": `repeat(${gameState().gridSize}, 1fr)`,
              display: "inline-grid",
            }}
          >
            <For each={gameState().grid}>
              {(color, index) => (
                <div
                  class="pixel"
                  style={{ "background-color": color }}
                  data-index={index()}
                  onClick={() => handleGridClick(index())}
                ></div>
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={message()}>
        <div id="message">{message()}</div>
      </Show>

      <Controls
        currentState={gameState().currentState}
        startGame={startGame}
        pauseGame={pauseGame}
        cancelGame={cancelGame}
        showMenu={showMenu}
      />
    </div>
  );
}

export default App;
