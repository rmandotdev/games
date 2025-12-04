import { onMount, Show } from "solid-js";

import { useGame } from "~/hooks/useGame";

import GameBoard from "./GameBoard";

function App() {
  const {
    init,
    score,
    state,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    getProjection
  } = useGame();

  onMount(init);

  return (
    <div id="game-container">
      <div id="game-board" class="no-select">
        <GameBoard board={getProjection} />
      </div>

      <div>
        <div id="score">Score: {score()}</div>

        <div id="button-container" class="no-select">
          <Show when={state() === "notstarted"}>
            <button id="start-button" class="button" onClick={startGame}>
              Start Game
            </button>
          </Show>

          <Show when={state() === "ongoing"}>
            <button id="pause-button" class="button" onClick={pauseGame}>
              Pause Game
            </button>
          </Show>

          <Show when={state() === "paused"}>
            <button id="resume-button" class="button" onClick={resumeGame}>
              Resume Game
            </button>

            <button id="reset-button" class="button" onClick={resetGame}>
              Reset
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default App;
