import { Show } from "solid-js";
import type { Cell, Player } from "#types";
import GameBoard from "./GameBoard";
import Button from "./ui/Button";

type GameSectionProps = {
  board: Cell[][];
  gameOver: boolean;
  hoveredCell: { row: number; col: number } | null;
  currentPlayer: Player;
  message: string;
  handleClick(col: number): void;
  handleHover(col: number): void;
  handleMouseOut(): void;
  startNewGame(): void;
  showMainMenu(): void;
};

function GameSection(props: GameSectionProps) {
  return (
    <div class="items-center justify-items-center text-center">
      <GameBoard
        board={props.board}
        currentPlayer={props.currentPlayer}
        gameOver={props.gameOver}
        hoveredCell={props.hoveredCell}
        handleClick={props.handleClick}
        handleHover={props.handleHover}
        handleMouseOut={props.handleMouseOut}
      />

      <div class="mt-fluid h-6 text-center text-white text-xl">
        {props.message}
      </div>

      <Show when={props.gameOver}>
        <div class="w-full">
          <Button onClick={props.startNewGame} label="NEW GAME" />
          <Button onClick={props.showMainMenu} label="MAIN MENU" />
        </div>
      </Show>
    </div>
  );
}

export default GameSection;
