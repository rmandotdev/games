import { onMount } from "solid-js";
import { useGame } from "../_hooks/useGame";
import MenuSection from "./MenuSection";
import GameSection from "./GameSection";

import type { Direction } from "../_types";

export default function App() {
  const CONFIG = {
    gridSize: 4,
    initialTiles: 2,
  } as const;

  const {
    grid,
    score,
    gameOver,
    inMenu,
    setInMenu,
    initGame,
    move,
    checkGameOver,
    setGameOver,
  } = useGame(CONFIG.gridSize, CONFIG.initialTiles);

  onMount(() => {
    initGame();

    function handleKeyDown(e: KeyboardEvent) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        move(e.key.toLowerCase().replace("arrow", "") as Direction);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div id="game-container" class="container">
      <MenuSection
        inMenu={inMenu()}
        onStartGame={initGame}
        onResumeGame={() => setInMenu(false)}
        isGameOver={checkGameOver(grid())}
      />

      <GameSection
        inMenu={inMenu()}
        gameOver={gameOver()}
        score={score()}
        grid={grid()}
        onShowMenu={() => {
          setInMenu(true);
          setGameOver(false);
        }}
        onRestartGame={initGame}
      />
    </div>
  );
}
