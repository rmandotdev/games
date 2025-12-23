import { For, Show } from "solid-js";
import type { Component } from "solid-js";

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

const GameSection: Component<GameSectionProps> = (props) => {
  return (
    <Show when={!props.showMenu}>
      <div id="game-section" class="section">
        <div id="game-board">
          <div id="board">
            <For each={props.board}>
              {(row, rowIndex) => (
                <For each={row}>
                  {(cell, colIndex) => (
                    <div
                      class="cell-wrapper"
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
                        class={`cell ${
                          cell === 1
                            ? "red"
                            : cell === 2
                              ? "yellow"
                              : props.hoveredCell &&
                                  props.hoveredCell.row === rowIndex() &&
                                  props.hoveredCell.col === colIndex()
                                ? props.currentPlayer === 1
                                  ? "hover-red"
                                  : "hover-yellow"
                                : ""
                        }`}
                      />
                    </div>
                  )}
                </For>
              )}
            </For>
          </div>
        </div>

        <div id="message">{props.message}</div>

        <Show when={props.gameOver}>
          <div id="game-over-menu">
            <button id="new-game-button" onClick={props.startNewGame}>
              NEW GAME
            </button>
            <button id="menu-button" onClick={props.showMainMenu}>
              MAIN MENU
            </button>
          </div>
        </Show>
      </div>
    </Show>
  );
};

export default GameSection;
