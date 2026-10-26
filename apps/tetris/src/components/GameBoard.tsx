import { For } from "solid-js";

import Cell from "./Cell";

function GameBoard(props: { board: number[][] }) {
  return (
    <div class="w-board rounded-5 border-cyan grid aspect-1/2 touch-manipulation grid-cols-10 grid-rows-20 border-2 bg-black/80 select-none">
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
