import { createSignal, Show } from "solid-js";

import type { Cell, Player } from "#types";

import GameSection from "./GameSection";
import MenuSection from "./MenuSection";

function App() {
  const CONFIG = {
    cols: 7,
    rows: 6,
    winLength: 4,
  } as const;

  const [currentPlayer, setCurrentPlayer] = createSignal<Player>(1);
  const [board, setBoard] = createSignal<Cell[][]>(
    Array(CONFIG.rows)
      .fill(null)
      .map(() => Array<Cell>(CONFIG.cols).fill(0)),
  );
  const [showMenu, setShowMenu] = createSignal(true);
  const [gameOver, setGameOver] = createSignal(false);
  const [message, setMessageContent] = createSignal("Player 1 starts");
  const [hoveredCell, setHoveredCell] = createSignal<{
    row: number;
    col: number;
  } | null>(null);

  function resetGame() {
    setCurrentPlayer(1);
    setBoard(
      Array(CONFIG.rows)
        .fill(null)
        .map(() => Array(CONFIG.cols).fill(0)),
    );
    setMessageContent("Player 1 starts");
  }

  function startNewGame() {
    setShowMenu(false);
    setGameOver(false);
    resetGame();
  }

  function getLowestEmptyRow(col: number) {
    const currentBoard = board();
    for (let row = CONFIG.rows - 1; row >= 0; row--) {
      if (currentBoard[row]?.[col] === 0) return row;
    }
    return -1;
  }

  function dropPiece(col: number) {
    const currentBoard = board();
    for (let row = CONFIG.rows - 1; row >= 0; row--) {
      if (currentBoard[row]?.[col] === 0) {
        const newBoard = currentBoard.map((r) => [...r]);
        newBoard[row]![col] = currentPlayer();
        setBoard(newBoard);
        return row;
      }
    }
    return -1;
  }

  function checkWin(row: number, col: number) {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ] as const;
    const currentBoard = board();
    for (const [dx, dy] of directions) {
      let count = 1;
      for (let i = 1; i < CONFIG.winLength; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (
          newRow < 0 ||
          newRow >= CONFIG.rows ||
          newCol < 0 ||
          newCol >= CONFIG.cols ||
          currentBoard[newRow]?.[newCol] !== currentPlayer()
        )
          break;
        count++;
      }
      for (let i = 1; i < CONFIG.winLength; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        if (
          newRow < 0 ||
          newRow >= CONFIG.rows ||
          newCol < 0 ||
          newCol >= CONFIG.cols ||
          currentBoard[newRow]?.[newCol] !== currentPlayer()
        )
          break;
        count++;
      }
      if (count >= CONFIG.winLength) return true;
    }
    return false;
  }

  function checkDraw() {
    return board()[0]?.every((cell) => cell !== 0);
  }

  function handleClick(col: number) {
    const row = dropPiece(col);
    if (row === -1) return;
    setHoveredCell(null);
    if (checkWin(row, col)) {
      setMessageContent(`Player ${currentPlayer()} wins!`);
      setGameOver(true);
    } else if (checkDraw()) {
      setMessageContent("It's a draw!");
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer() === 1 ? 2 : 1);
      setMessageContent(`Player ${currentPlayer()}`);
    }
  }

  function handleHover(col: number) {
    const row = getLowestEmptyRow(col);
    if (row !== -1) {
      setHoveredCell({ row, col });
    }
  }

  return (
    <div class="menu-bg flex w-fit flex-col items-center rounded-10 bg-black/80 p-fluid shadow-menu">
      <h1 class="mb-fluid whitespace-nowrap text-center font-bold text-board-title text-shadow-title-glow text-white">
        Connect Four
      </h1>

      <Show when={!showMenu()}>
        <GameSection
          board={board()}
          currentPlayer={currentPlayer()}
          gameOver={gameOver()}
          handleClick={handleClick}
          handleHover={handleHover}
          handleMouseOut={() => setHoveredCell(null)}
          hoveredCell={hoveredCell()}
          message={message()}
          showMainMenu={() => setShowMenu(true)}
          startNewGame={startNewGame}
        />
      </Show>

      <Show when={showMenu()}>
        <MenuSection startNewGame={startNewGame} />
      </Show>
    </div>
  );
}

export default App;
