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
      {/* must not have gap, otherwise clicking between cells will be broken */}
      <div class="grid aspect-7/6 height-600:w-game-board-600 height-700:w-game-board-700 height-800:w-game-board-800 w-game-board max-w-full grid-cols-7 grid-rows-6 rounded-5 bg-board p-2 sm:p-4 md:w-150">
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
