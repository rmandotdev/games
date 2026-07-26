import { onMount, Show } from "solid-js";

import { useGame } from "#hooks/useGame";
import GameBoard from "./GameBoard";
import Button from "./ui/Button";

function App() {
  const {
    init,
    score,
    state,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    getProjection,
  } = useGame();

  onMount(init);

  return (
    <div class="flex w-fit flex-row items-center gap-2.5 p-1.25">
      <GameBoard board={getProjection()} />

      <div class="flex flex-col items-center gap-2.5">
        <div class="select-none text-base text-glow-cyan">Score: {score()}</div>

        <div class="flex select-none flex-col items-center gap-5">
          <Show when={state() === "notstarted"}>
            <Button label="Start Game" onClick={startGame} />
          </Show>

          <Show when={state() === "ongoing"}>
            <Button label="Pause Game" onClick={pauseGame} />
          </Show>

          <Show when={state() === "paused"}>
            <Button label="Resume Game" onClick={resumeGame} />
            <Button label="Reset" onClick={resetGame} danger />
          </Show>
        </div>
      </div>
    </div>
  );
}

export default App;
