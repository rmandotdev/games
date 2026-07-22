import { Show } from "solid-js";

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

        <div class="text-xl">
          Score: <span class="font-bold">{props.score}</span>
        </div>

        <div
          class="grid bg-grid rounded-[5px] p-2.5 m-5 gap-(--spacing-grid-gap)"
          style={{
            "grid-template-columns": `repeat(${props.grid.length}, 1fr)`,
          }}
        >
          {props.grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                class={`cell color-${cell === 0 ? "empty" : cell} size-(--spacing-cell) bg-cell rounded-[5px] flex justify-center items-center text-2xl font-bold text-cell-text`}
                data-row={i}
                data-col={j}
              >
                {cell === 0 ? "" : cell}
              </div>
            )),
          )}
        </div>

        <div class="flex justify-center">
          <button
            class="text-base py-2.5 px-5 m-2.5 cursor-pointer bg-btn text-btn-text border-0 rounded-[5px] flex items-center justify-center"
            onClick={props.onShowMenu}
          >
            Menu
          </button>
          <button
            class="text-base py-2.5 px-5 m-2.5 cursor-pointer bg-btn text-btn-text border-0 rounded-[5px] flex items-center justify-center"
            onClick={props.onRestartGame}
          >
            Restart
          </button>
        </div>
      </div>
    </Show>
  );
}

export default GameSection;
