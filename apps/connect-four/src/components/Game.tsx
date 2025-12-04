import { createSignal, onMount } from "solid-js";

import GameSection from "./GameSection";
import MenuSection from "./MenuSection";

function App() {
  const CONFIG = {
    cols: 7,
    rows: 6,
    winLength: 4,
  } as const;

  const [currentPlayer, setCurrentPlayer] = createSignal(1);
  const [board, setBoard] = createSignal(
    Array(CONFIG.rows)
      .fill(null)
      .map(() => Array(CONFIG.cols).fill(0)) as number[][]
  );
  const [showMenu, setShowMenu] = createSignal(true);
  const [gameOver, setGameOver] = createSignal(false);
  const [message, setMessageContent] = createSignal("Player 1 starts");
  const [hoveredCell, setHoveredCell] = createSignal<{
    row: number;
    col: number;
  } | null>(null);

  function startNewGame() {
    setShowMenu(false);
    setGameOver(false);
    resetGame();
  }

  function showMainMenu() {
    setShowMenu(true);
  }

  function getLowestEmptyRow(col: number) {
    const currentBoard = board();
    for (let row = CONFIG.rows - 1; row >= 0; row--) {
      if (currentBoard[row]![col] === 0) return row;
    }
    return -1;
  }

  function dropPiece(col: number) {
    const currentBoard = board();
    for (let row = CONFIG.rows - 1; row >= 0; row--) {
      if (currentBoard[row]![col] === 0) {
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
    for (let [dx, dy] of directions) {
      let count = 1;
      for (let i = 1; i < CONFIG.winLength; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (
          newRow < 0 ||
          newRow >= CONFIG.rows ||
          newCol < 0 ||
          newCol >= CONFIG.cols ||
          currentBoard[newRow]![newCol] !== currentPlayer()
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
          currentBoard[newRow]![newCol] !== currentPlayer()
        )
          break;
        count++;
      }
      if (count >= CONFIG.winLength) return true;
    }
    return false;
  }

  function checkDraw() {
    return board()[0]!.every((cell) => cell !== 0);
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

  function handleMouseOut() {
    setHoveredCell(null);
  }

  function resetGame() {
    setCurrentPlayer(1);
    setBoard(
      Array(CONFIG.rows)
        .fill(null)
        .map(() => Array(CONFIG.cols).fill(0))
    );
    setMessageContent("Player 1 starts");
  }

  function updateCellSize() {
    const width = (window.innerWidth - 70) / (CONFIG.cols * 1.15);
    const height = (window.innerHeight - 270) / (CONFIG.rows * 1.15);
    const cellSize = Math.min(height, width);
    document.documentElement.style.setProperty("--cell-size", `${cellSize}px`);
  }

  onMount(() => {
    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  });

  return (
    <div id="game-container">
      <h1 id="title">Connect Four</h1>

      <GameSection
        board={board()}
        currentPlayer={currentPlayer()}
        gameOver={gameOver()}
        handleClick={handleClick}
        handleHover={handleHover}
        handleMouseOut={handleMouseOut}
        hoveredCell={hoveredCell()}
        message={message()}
        showMainMenu={showMainMenu}
        showMenu={showMenu()}
        startNewGame={startNewGame}
      />

      <MenuSection 
      showMenu={showMenu()} startNewGame={startNewGame} />
    </div>
  );
}

export default App;
