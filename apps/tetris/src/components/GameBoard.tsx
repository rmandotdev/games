import { For } from "solid-js";

import Cell from "./Cell";

function GameBoard(props: { board: number[][] }) {
  return (
    <div class="grid aspect-1/2 w-board touch-manipulation select-none grid-cols-10 grid-rows-20 rounded-5 border-2 border-cyan bg-black/80">
      <For each={props.board}>
        {(cells, y) => (
          <For each={cells}>
            {(cell, x) => <Cell x={x()} y={y()} colorIndex={cell} />}
          </For>
        )}
      </For>
    </div>
  );
}

export default GameBoard;
