import { Show } from "solid-js";
import type { Component } from "solid-js";

type GameSectionProps = {
  inMenu: boolean;
  gameOver: boolean;
  score: number;
  grid: number[][];
  onShowMenu: () => void;
  onRestartGame: () => void;
};

const GameSection: Component<GameSectionProps> = (props) => {
  return (
    <Show when={!props.inMenu}>
      <div id="game-section" class="section">
        <Show when={props.gameOver}>
          <h2 id="game-over">Game Over!</h2>
        </Show>

        <div id="score">
          Score: <span id="score-value">{props.score}</span>
        </div>

        <div
          id="grid"
          class="no-select"
          style={{
            display: "grid",
            "grid-template-columns": `repeat(${props.grid.length}, 1fr)`,
          }}
        >
          {props.grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                class={`cell color-${cell === 0 ? "empty" : cell}`}
                data-row={i}
                data-col={j}
              >
                {cell === 0 ? "" : cell}
              </div>
            ))
          )}
        </div>

        <div id="controls">
          <button onClick={props.onShowMenu} id="show-menu">
            Menu
          </button>
          <button onClick={props.onRestartGame} id="restart-game">
            Restart
          </button>
        </div>
      </div>
    </Show>
  );
};

export default GameSection;
