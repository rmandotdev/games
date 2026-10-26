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
          class="gap-grid-gap bg-grid dark:bg-grid-dark m-5 grid rounded-[5px] p-2.5"
          style={{
            "grid-template-columns": `repeat(${props.grid.length}, 1fr)`,
          }}
        >
          {props.grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                class={`cell size-cell bg-cell text-cell-text dark:bg-cell-dark flex items-center justify-center rounded-[5px] text-2xl font-bold`}
                classList={{
                  "color-empty": cell === 0,
                  [`color-${cell}`]: cell !== 0,
                }}
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
