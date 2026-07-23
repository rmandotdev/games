import { For } from "solid-js";
import type { Cell, Player } from "#types";
import BoardCell from "./BoardCell";

function GameBoard(props: {
  board: Cell[][];
  currentPlayer: Player;
  gameOver: boolean;
  hoveredCell: { row: number; col: number } | null;
  handleClick(col: number): void;
  handleHover(col: number): void;
  handleMouseOut(): void;
}) {
  return (
    <div class="flex w-full flex-col items-center">
      <div class="grid w-full max-w-[92vw] grid-cols-7 gap-1.5 rounded-5 bg-board p-2 sm:gap-2.5 sm:p-4 lg:max-w-175 xl:max-w-200">
        <For each={props.board}>
          {(row, rowIndex) => (
            <For each={row}>
              {(cell, colIndex) => {
                const cellHovered = () =>
                  props.hoveredCell &&
                  props.hoveredCell.row === rowIndex() &&
                  props.hoveredCell.col === colIndex();

                return (
                  <BoardCell
                    cell={cell}
                    cellHovered={!!cellHovered()}
                    colIndex={colIndex()}
                    rowIndex={rowIndex()}
                    currentPlayer={props.currentPlayer}
                    gameOver={props.gameOver}
                    handleClick={props.handleClick}
                    handleHover={props.handleHover}
                    handleMouseOut={props.handleMouseOut}
                  />
                );
              }}
            </For>
          )}
        </For>
      </div>
    </div>
  );
}

export default GameBoard;
