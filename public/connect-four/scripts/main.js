const CONFIG = {
  cols: 7, // number of columns in the game board
  rows: 6, // number of rows in the game board
  winLength: 4, // number of pieces in a row needed to win
};

let gameState = {
  currentPlayer: 1,
  board: Array(CONFIG.rows)
    .fill()
    .map(() => Array(CONFIG.cols).fill(0)),
};

function showMainMenu() {
  document.getElementById("menu-section").classList.remove("hidden");
  document.getElementById("game-section").classList.add("hidden");
}

function startNewGame() {
  document.getElementById("menu-section").classList.add("hidden");
  document.getElementById("game-section").classList.remove("hidden");
  document.getElementById("game-over-menu").classList.add("hidden");
  resetGame();
}

function showGameOverMenu() {
  document.getElementById("game-over-menu").classList.remove("hidden");
}

function createBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  for (let row = 0; row < CONFIG.rows; row++) {
    for (let col = 0; col < CONFIG.cols; col++) {
      const cellWrapper = document.createElement("div");
      cellWrapper.className = "cell-wrapper";
      cellWrapper.dataset.col = col;
      cellWrapper.dataset.row = row;
      const cell = document.createElement("div");
      cell.className = "cell";
      cellWrapper.appendChild(cell);
      boardElement.appendChild(cellWrapper);
    }
  }
  boardElement.addEventListener("mouseover", handleHover);
  boardElement.addEventListener("mouseout", handleMouseOut);
  updateCellSize();
}

function handleHover(e) {
  if (
    e.target.classList.contains("cell-wrapper") ||
    e.target.classList.contains("cell")
  ) {
    const wrapper = e.target.classList.contains("cell-wrapper")
      ? e.target
      : e.target.parentElement;
    const col = parseInt(wrapper.dataset.col);
    const hoverRow = getLowestEmptyRow(col);
    if (hoverRow !== -1) {
      const hoverCell = document.querySelector(
        `.cell-wrapper[data-row="${hoverRow}"][data-col="${col}"] .cell`
      );
      hoverCell.classList.add(
        gameState.currentPlayer === 1 ? "hover-red" : "hover-yellow"
      );
    }
  }
}

function handleMouseOut(e) {
  if (
    e.target.classList.contains("cell-wrapper") ||
    e.target.classList.contains("cell")
  ) {
    const wrapper = e.target.classList.contains("cell-wrapper")
      ? e.target
      : e.target.parentElement;
    const col = parseInt(wrapper.dataset.col);
    const hoverRow = getLowestEmptyRow(col);
    if (hoverRow !== -1) {
      const hoverCell = document.querySelector(
        `.cell-wrapper[data-row="${hoverRow}"][data-col="${col}"] .cell`
      );
      hoverCell.classList.remove("hover-red", "hover-yellow");
    }
  }
}

function getLowestEmptyRow(col) {
  for (let row = CONFIG.rows - 1; row >= 0; row--) {
    if (gameState.board[row][col] === 0) {
      return row;
    }
  }
  return -1;
}

function dropPiece(col) {
  for (let row = CONFIG.rows - 1; row >= 0; row--) {
    if (gameState.board[row][col] === 0) {
      gameState.board[row][col] = gameState.currentPlayer;
      return row;
    }
  }
  return -1;
}

function checkWin(row, col) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
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
        gameState.board[newRow][newCol] !== gameState.currentPlayer
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
        gameState.board[newRow][newCol] !== gameState.currentPlayer
      )
        break;
      count++;
    }
    if (count >= CONFIG.winLength) return true;
  }
  return false;
}

function checkDraw() {
  return gameState.board[0].every((cell) => cell !== 0);
}

function updateBoard() {
  const cellWrappers = document.querySelectorAll(".cell-wrapper");
  for (let row = 0; row < CONFIG.rows; row++) {
    for (let col = 0; col < CONFIG.cols; col++) {
      const index = row * CONFIG.cols + col;
      const cell = cellWrappers[index].querySelector(".cell");
      cell.className = "cell";
      if (gameState.board[row][col] === 1) cell.classList.add("red");
      if (gameState.board[row][col] === 2) cell.classList.add("yellow");
    }
  }
}

function handleClick(e) {
  const wrapper = e.target.closest(".cell-wrapper");
  if (!wrapper) return;
  const col = parseInt(wrapper.dataset.col);
  const row = dropPiece(col);
  if (row === -1) return;
  updateBoard();
  // Remove hover effect immediately after placing a piece
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("hover-red", "hover-yellow");
  });
  if (checkWin(row, col)) {
    document.getElementById(
      "message"
    ).textContent = `Player ${gameState.currentPlayer} wins!`;
    document.getElementById("board").removeEventListener("click", handleClick);
    document
      .getElementById("board")
      .removeEventListener("mouseover", handleHover);
    document
      .getElementById("board")
      .removeEventListener("mouseout", handleMouseOut);
    showGameOverMenu();
  } else if (checkDraw()) {
    document.getElementById("message").textContent = "It's a draw!";
    document
      .getElementById("board")
      .removeEventListener("mouseover", handleHover);
    document
      .getElementById("board")
      .removeEventListener("mouseout", handleMouseOut);
    showGameOverMenu();
  } else {
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    document.getElementById(
      "message"
    ).textContent = `Player ${gameState.currentPlayer}`;
    // Update hover effect for the new current player
    const hoverRow = getLowestEmptyRow(col);
    if (hoverRow !== -1) {
      const hoverCell = document.querySelector(
        `.cell-wrapper[data-row="${hoverRow}"][data-col="${col}"] .cell`
      );
      hoverCell.classList.add(
        gameState.currentPlayer === 1 ? "hover-red" : "hover-yellow"
      );
    }
  }
}

function resetGame() {
  gameState.board = Array(CONFIG.rows)
    .fill()
    .map(() => Array(CONFIG.cols).fill(0));
  gameState.currentPlayer = 1;
  createBoard();
  updateBoard();
  document.getElementById(
    "message"
  ).textContent = `Player ${gameState.currentPlayer}`;
  document.getElementById("board").addEventListener("click", handleClick);
  document.getElementById("board").addEventListener("mouseover", handleHover);
  document.getElementById("board").addEventListener("mouseout", handleMouseOut);
}

function updateCellSize() {
  const width = (window.innerWidth - 70) / (CONFIG.cols * 1.15);
  const height = (window.innerHeight - 270) / (CONFIG.rows * 1.15);
  const cellSize = Math.min(height, width);
  document.documentElement.style.setProperty("--cell-size", `${cellSize}px`);
}

window.addEventListener("resize", updateCellSize);

document
  .getElementById("start-game-button")
  .addEventListener("click", startNewGame);
document
  .getElementById("new-game-button")
  .addEventListener("click", startNewGame);
document.getElementById("menu-button").addEventListener("click", showMainMenu);

showMainMenu();

export {};
