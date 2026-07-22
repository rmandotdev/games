import { Show } from "solid-js";

import Button from "./ui/Button";

type GameSectionProps = {
  inMenu: boolean;
  gameOver: boolean;
  score: number;
  grid: number[][];
  onShowMenu(): void;
  onRestartGame(): void;
};

function GameSection(props: GameSectionProps) {
  return (
    <Show when={!props.inMenu}>
      <div class="flex flex-col items-center">
        <Show when={props.gameOver}>
          <h2 class="text-2xl font-bold">Game Over!</h2>
        </Show>

        <div class="text-2xl">
          Score: <span>{props.score}</span>
        </div>

        <div
          class="grid bg-grid dark:bg-grid-dark rounded-[5px] p-2.5 m-5 gap-grid-gap"
          style={{
            "grid-template-columns": `repeat(${props.grid.length}, 1fr)`,
          }}
        >
          {props.grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                class={`cell color-${cell === 0 ? "empty" : cell} size-cell bg-cell dark:bg-cell-dark rounded-[5px] flex justify-center items-center text-2xl font-bold text-cell-text`}
                data-row={i}
                data-col={j}
              >
                {cell === 0 ? "" : cell}
              </div>
            )),
          )}
        </div>

        <div class="flex justify-center">
          <Button label="Menu" onClick={props.onShowMenu} />
          <Button label="Restart" onClick={props.onRestartGame} />
        </div>
      </div>
    </Show>
  );
}

export default GameSection;
