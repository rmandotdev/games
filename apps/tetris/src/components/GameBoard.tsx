import { For } from "solid-js";

import Cell from "./Cell";

const GameBoard = (props: { board: () => number[][] }) => {
  return (
    <For each={props.board()}>
      {(cells, y) => (
        <For each={cells}>
          {(cell, x) => <Cell x={x()} y={y()} colorIndex={cell} />}
        </For>
      )}
    </For>
  );
};

export default GameBoard;
