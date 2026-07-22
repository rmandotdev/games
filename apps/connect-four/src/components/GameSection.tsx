import { For, Show } from "solid-js";

type GameSectionProps = {
  showMenu: boolean;
  board: number[][];
  gameOver: boolean;
  hoveredCell: { row: number; col: number } | null;
  currentPlayer: number;
  message: string;
  handleClick: (_: number) => void;
  handleHover: (_: number) => void;
  handleMouseOut: () => void;
  startNewGame: () => void;
  showMainMenu: () => void;
};

function GameSection(props: GameSectionProps) {
  return (
    <Show when={!props.showMenu}>
      <div class="justify-items-center text-center items-center">
        <div class="flex flex-col items-center">
          <div
            class="flex flex-wrap bg-board rounded-[5px] p-[5px]"
            style={{
              width: `calc(7 * (var(--cell-size) + var(--cell-padding) * 2))`,
            }}
          >
            <For each={props.board}>
              {(row, rowIndex) => (
                <For each={row}>
                  {(cell, colIndex) => (
                    <div
                      class="cursor-pointer flex justify-center items-center"
                      style={{
                        width: "var(--cell-size)",
                        height: "var(--cell-size)",
                        padding: "var(--cell-padding)",
                      }}
                      data-col={colIndex()}
                      data-row={rowIndex()}
                      onClick={() =>
                        !props.gameOver && props.handleClick(colIndex())
                      }
                      onMouseOver={() =>
                        !props.gameOver && props.handleHover(colIndex())
                      }
                      onMouseOut={() =>
                        !props.gameOver && props.handleMouseOut()
                      }
                    >
                      <div
                        class={`cell w-full h-full rounded-full ${
                          cell === 1
                            ? "bg-player1"
                            : cell === 2
                              ? "bg-player2"
                              : props.hoveredCell &&
                                  props.hoveredCell.row === rowIndex() &&
                                  props.hoveredCell.col === colIndex()
                                ? props.currentPlayer === 1
                                  ? "bg-red-500/70"
                                  : "bg-yellow-400/70"
                                : "bg-black"
                        }`}
                      />
                    </div>
                  )}
                </For>
              )}
            </For>
          </div>
        </div>

        <div
          class="text-white text-center text-xl h-6 mt-5"
          style={{ "margin-top": "min(20px, 10%)" }}
        >
          {props.message}
        </div>

        <Show when={props.gameOver}>
          <div class="w-full">
            <button
              class="whitespace-nowrap inline-block text-white border-0 rounded-[5px] cursor-pointer text-base bg-btn hover:bg-btn-hover"
              style={{ margin: "10px", padding: "10px min(20px, 10%)" }}
              onClick={props.startNewGame}
            >
              NEW GAME
            </button>
            <button
              class="whitespace-nowrap inline-block text-white border-0 rounded-[5px] cursor-pointer text-base bg-btn hover:bg-btn-hover"
              style={{ margin: "10px", padding: "10px min(20px, 10%)" }}
              onClick={props.showMainMenu}
            >
              MAIN MENU
            </button>
          </div>
        </Show>
      </div>
    </Show>
  );
}

export default GameSection;
