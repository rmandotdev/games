import type { Cell, Player } from "#types";

function BoardCell(props: {
  cell: Cell;
  currentPlayer: Player;
  cellHovered: boolean;
  colIndex: number;
  rowIndex: number;
  gameOver: boolean;
  handleClick(col: number): void;
  handleHover(col: number): void;
  handleMouseOut(): void;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: Changing this to a button won't work
    <div
      role="button"
      tabIndex={props.gameOver ? -1 : 0}
      aria-label={`Column ${props.colIndex + 1}, Row ${props.rowIndex + 1}`}
      class="cursor-pointer flex justify-center items-center size-cell p-cell-padding touch-manipulation"
      data-col={props.colIndex}
      data-row={props.rowIndex}
      onClick={() => !props.gameOver && props.handleClick(props.colIndex)}
      onKeyDown={(e) => {
        if (!props.gameOver && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          props.handleClick(props.colIndex);
        }
      }}
      onMouseEnter={() => !props.gameOver && props.handleHover(props.colIndex)}
      onMouseLeave={() => !props.gameOver && props.handleMouseOut()}
      onFocus={() => !props.gameOver && props.handleHover(props.colIndex)}
      onBlur={() => !props.gameOver && props.handleMouseOut()}
    >
      <div
        class={`transition-colors duration-transition w-full h-full rounded-full`}
        classList={{
          "bg-player1 shadow-glow-p1 scale-100": props.cell === 1,
          "bg-player2 shadow-glow-p2 scale-100": props.cell === 2,

          "bg-black scale-95": props.cell === 0 && !props.cellHovered,

          "bg-player1/70 scale-95":
            props.cell === 0 && props.cellHovered && props.currentPlayer === 1,
          "bg-player2/75 scale-95":
            props.cell === 0 && props.cellHovered && props.currentPlayer === 2,
        }}
      />
    </div>
  );
}

export default BoardCell;
