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
          <h2 class="font-bold text-2xl">Game Over!</h2>
        </Show>

        <div class="text-2xl">
          Score: <span>{props.score}</span>
        </div>

        <div
          class="m-5 grid gap-grid-gap rounded-[5px] bg-grid p-2.5 dark:bg-grid-dark"
          style={{
            "grid-template-columns": `repeat(${props.grid.length}, 1fr)`,
          }}
        >
          {props.grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                class={`cell color-${cell === 0 ? "empty" : cell} flex size-cell items-center justify-center rounded-[5px] bg-cell font-bold text-2xl text-cell-text dark:bg-cell-dark`}
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
