import { onMount } from "solid-js";

type Shape = (0 | 1)[][];

type TetrmoinoShape = {
  shape: Shape;
  color: string;
};

type GameConfig = {
  boardWidth: number;
  boardHeight: number;
  initialSpeed: number;
  speedIncrease: number;
  scorePerLine: number;
  minBlockSize: number;
  tetrominoShapes: TetrmoinoShape[];
};

const CONFIG: GameConfig = {
  boardWidth: 10,
  boardHeight: 20,
  initialSpeed: 1000,
  speedIncrease: 50,
  scorePerLine: 100,
  minBlockSize: 15,
  tetrominoShapes: [
    {
      shape: [[1, 1, 1, 1]],
      color: "var(--tetromino-color-0)",
    },
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "var(--tetromino-color-1)",
    },
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
      ],
      color: "var(--tetromino-color-2)",
    },
    {
      shape: [
        [1, 1, 1],
        [1, 0, 0],
      ],
      color: "var(--tetromino-color-3)",
    },
    {
      shape: [
        [1, 1, 1],
        [0, 0, 1],
      ],
      color: "var(--tetromino-color-4)",
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ],
      color: "var(--tetromino-color-5)",
    },
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
      ],
      color: "var(--tetromino-color-6)",
    },
  ],
};

type GameState = {
  gameBoard: number[][];
  currentTetromino: {
    shape: Shape;
    x: number;
    y: number;
    color: string;
    colorIndex: number;
  } | null;
  score: number;
  gameInterval: number | undefined;
  gameStarted: boolean;
  gamePaused: boolean;
};

function init() {
  const gameState: GameState = {
    gameBoard: [],
    currentTetromino: null,
    score: 0,
    gameInterval: undefined,
    gameStarted: false,
    gamePaused: false,
  };

  const containerElement = document.getElementById(
    "game-container"
  ) as HTMLDivElement;
  const gameboardElement = document.getElementById(
    "game-board"
  ) as HTMLDivElement;
  const scoreElement = document.getElementById("score") as HTMLDivElement;
  const startButton = document.getElementById(
    "start-button"
  ) as HTMLButtonElement;
  const pauseButton = document.getElementById(
    "pause-button"
  ) as HTMLButtonElement;
  const resetButton = document.getElementById(
    "reset-button"
  ) as HTMLButtonElement;

  function updateBoardDimensions() {
    const maxWidth = containerElement.clientWidth * 0.95;
    const maxHeight = window.innerHeight - 120;
    const blockSize = Math.max(
      CONFIG.minBlockSize,
      Math.min(maxWidth / CONFIG.boardWidth, maxHeight / CONFIG.boardHeight)
    );
    const newWidth = CONFIG.boardWidth * blockSize;
    const newHeight = CONFIG.boardHeight * blockSize;
    document.documentElement.style.setProperty(
      "--board-width",
      `${newWidth}px`
    );
    document.documentElement.style.setProperty(
      "--board-height",
      `${newHeight}px`
    );
    document.documentElement.style.setProperty(
      "--block-size",
      `${blockSize}px`
    );
    document.documentElement.style.setProperty(
      "--grid-columns",
      `repeat(${CONFIG.boardWidth}, 1fr)`
    );
    document.documentElement.style.setProperty(
      "--grid-rows",
      `repeat(${CONFIG.boardHeight}, 1fr)`
    );
  }

  function initializeBoard() {
    gameState.gameBoard = [];
    gameboardElement.innerHTML = "";
    for (let y = 0; y < CONFIG.boardHeight; y++) {
      gameState.gameBoard[y] = [];
      for (let x = 0; x < CONFIG.boardWidth; x++) {
        gameState.gameBoard[y]![x] = 0;
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.dataset.x = `${x}`;
        cell.dataset.y = `${y}`;
        gameboardElement.appendChild(cell);
      }
    }
  }

  type MaxDepth = 999;

  type IsGeneralNumber<N> = number extends N
    ? N extends number
      ? true
      : false
    : false;

  type BuildTuple<
    L extends number,
    T extends unknown[] = []
  > = IsGeneralNumber<L> extends true
    ? number[]
    : T["length"] extends L
    ? T
    : T["length"] extends MaxDepth
    ? number[]
    : BuildTuple<L, [...T, T["length"]]>;

  type XRange<N extends number> = BuildTuple<N> extends (infer R)[] ? R : never;

  function randomInt<const N extends number>(max: N): XRange<N> {
    return Math.floor(Math.random() * max) as XRange<N>;
  }

  function createTetromino() {
    const shapeIndex = randomInt(CONFIG.tetrominoShapes.length);
    const tetrominoData = CONFIG.tetrominoShapes[shapeIndex]!;
    return {
      shape: JSON.parse(
        JSON.stringify(tetrominoData.shape)
      ) as typeof tetrominoData.shape,
      x:
        Math.floor(CONFIG.boardWidth / 2) -
        Math.floor(tetrominoData.shape[0]!.length / 2),
      y: 0,
      color: tetrominoData.color,
      colorIndex: shapeIndex,
    };
  }

  function drawTetromino() {
    if (!gameState.currentTetromino) return;
    gameState.currentTetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const cellX = gameState.currentTetromino!.x + x;
          const cellY = gameState.currentTetromino!.y + y;
          const cell = gameboardElement.querySelector(
            `[data-x="${cellX}"][data-y="${cellY}"]`
          );
          if (cell) {
            cell.classList.add(
              "tetromino",
              `tetromino-${gameState.currentTetromino!.colorIndex}`
            );
          }
        }
      });
    });
  }

  function moveTetromino(dx: number, dy: number) {
    if (!gameState.currentTetromino) return;
    gameState.currentTetromino.x += dx;
    gameState.currentTetromino.y += dy;
    if (collision()) {
      gameState.currentTetromino.x -= dx;
      gameState.currentTetromino.y -= dy;
      if (dy > 0) {
        mergeTetromino();
        gameState.currentTetromino = createTetromino();
        if (collision()) {
          gameOver();
        }
      }
    }
    updateGame();
  }

  function rotateTetromino() {
    if (!gameState.currentTetromino) return;
    const rotated = gameState.currentTetromino.shape[0]!.map((_, index) =>
      gameState.currentTetromino!.shape.map((row) => row[index]!).reverse()
    );
    const previousShape = gameState.currentTetromino.shape;
    gameState.currentTetromino.shape = rotated;
    if (collision()) {
      gameState.currentTetromino.shape = previousShape;
    }
    updateGame();
  }

  function collision() {
    if (!gameState.currentTetromino) return false;
    return gameState.currentTetromino.shape.some((row, dy) =>
      row.some((value, dx) => {
        if (!value) return false;
        const newY = gameState.currentTetromino!.y + dy;
        const newX = gameState.currentTetromino!.x + dx;
        return (
          newY >= CONFIG.boardHeight ||
          newX < 0 ||
          newX >= CONFIG.boardWidth ||
          (newY >= 0 && gameState.gameBoard[newY]![newX])
        );
      })
    );
  }

  function mergeTetromino() {
    if (!gameState.currentTetromino) return;
    gameState.currentTetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const newY = gameState.currentTetromino!.y + y;
          const newX = gameState.currentTetromino!.x + x;
          if (
            newY >= 0 &&
            newY < CONFIG.boardHeight &&
            newX >= 0 &&
            newX < CONFIG.boardWidth
          ) {
            gameState.gameBoard[newY]![newX] =
              gameState.currentTetromino!.colorIndex + 1;
          }
        }
      });
    });
    checkLines();
  }

  function checkLines() {
    let linesCleared = 0;
    for (let y = CONFIG.boardHeight - 1; y >= 0; y--) {
      if (gameState.gameBoard[y]!.every((cell) => cell !== 0)) {
        linesCleared++;
        gameState.gameBoard.splice(y, 1);
        gameState.gameBoard.unshift(new Array(CONFIG.boardWidth).fill(0));
        y++;
      }
    }
    if (linesCleared > 0) {
      gameState.score += linesCleared * CONFIG.scorePerLine;
      scoreElement.textContent = `Score: ${gameState.score}`;
      increaseSpeed();
    }
  }

  function increaseSpeed() {
    window.clearInterval(gameState.gameInterval);
    const speed = Math.max(
      100,
      CONFIG.initialSpeed -
        Math.floor(gameState.score / 1000) * CONFIG.speedIncrease
    );
    gameState.gameInterval = window.setInterval(gameLoop, speed);
  }

  function updateGame() {
    gameState.gameBoard.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cellElement = gameboardElement.querySelector(
          `[data-x="${x}"][data-y="${y}"]`
        )!;
        cellElement.className = "grid-cell";
        if (cell !== 0) {
          cellElement.classList.add("tetromino", `tetromino-${cell - 1}`);
        }
      });
    });
    if (gameState.currentTetromino) {
      drawTetromino();
    }
  }

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  function gameLoop() {
    if (!gameState.gamePaused && gameState.gameStarted) {
      moveTetromino(0, 1);
    }
  }

  function gameOver() {
    clearInterval(gameState.gameInterval);
    alert(`Game Over! Your score: ${gameState.score}`);
    gameState.gameStarted = false;
    startButton.style.display = "inline-block";
    pauseButton.style.display = "none";
    resetButton.style.display = "none";
  }

  function startGame() {
    if (!gameState.gameStarted) {
      updateBoardDimensions();
      initializeBoard();
      gameState.score = 0;
      scoreElement.textContent = "Score: 0";
      gameState.currentTetromino = createTetromino();
      gameState.gameInterval = window.setInterval(
        gameLoop,
        CONFIG.initialSpeed
      );
      gameState.gameStarted = true;
      gameState.gamePaused = false;
      startButton.style.display = "none";
      pauseButton.style.display = "inline-block";
      resetButton.style.display = "none";
      pauseButton.textContent = "Pause Game";
      updateGame();
    }
  }

  function pauseGame() {
    if (!gameState.gameStarted) return;
    if (gameState.gamePaused) {
      gameState.gameInterval = window.setInterval(
        gameLoop,
        CONFIG.initialSpeed
      );
      gameState.gamePaused = false;
      pauseButton.textContent = "Pause Game";
      resetButton.style.display = "none";
    } else {
      window.clearInterval(gameState.gameInterval);
      gameState.gamePaused = true;
      pauseButton.textContent = "Resume Game";
      resetButton.style.display = "inline-block";
    }
  }

  function resetGame() {
    if (
      confirm(
        "Are you sure you want to reset the game? Your current progress will be lost."
      )
    ) {
      clearInterval(gameState.gameInterval);
      gameState.gameStarted = false;
      gameState.gamePaused = false;
      startButton.style.display = "inline-block";
      pauseButton.style.display = "none";
      resetButton.style.display = "none";
      pauseButton.textContent = "Pause Game";
      initializeBoard();
      gameState.score = 0;
      scoreElement.textContent = "Score: 0";
      gameState.currentTetromino = null;
      updateGame();
    }
  }

  // Event Listeners
  startButton.addEventListener("click", startGame);
  pauseButton.addEventListener("click", pauseGame);
  resetButton.addEventListener("click", resetGame);

  document.addEventListener("keydown", (e) => {
    if (!gameState.gameStarted || gameState.gamePaused) return;
    switch (e.key) {
      case "ArrowLeft":
        moveTetromino(-1, 0);
        break;
      case "ArrowRight":
        moveTetromino(1, 0);
        break;
      case "ArrowDown":
        moveTetromino(0, 1);
        break;
      case "ArrowUp":
        rotateTetromino();
        break;
    }
  });

  if (isMobileDevice()) {
    document.documentElement.style.setProperty(
      "--font-family",
      "Arial, monospace"
    );

    let touchStartX = 0;
    let touchStartY = 0;
    let currentTouchX = 0;
    let currentTouchY = 0;
    let swipeInterval: number | null = null;

    gameboardElement.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0]!.screenX;
        touchStartY = e.changedTouches[0]!.screenY;
        currentTouchX = touchStartX;
        currentTouchY = touchStartY;
        if (swipeInterval) window.clearInterval(swipeInterval);
        swipeInterval = window.setInterval(handleSwipe, 175);
      },
      false
    );

    gameboardElement.addEventListener(
      "touchmove",
      function (e) {
        currentTouchX = e.changedTouches[0]!.screenX;
        currentTouchY = e.changedTouches[0]!.screenY;
      },
      false
    );

    gameboardElement.addEventListener(
      "touchend",
      function () {
        if (swipeInterval) window.clearInterval(swipeInterval);
        handleSwipe();
        if (touchStartX === currentTouchX && touchStartY === currentTouchY) {
          rotateTetromino();
        }
      },
      false
    );

    function handleSwipe() {
      if (!gameState.gameStarted || gameState.gamePaused) return;
      const diffX = touchStartX - currentTouchX;
      const diffY = touchStartY - currentTouchY;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          moveTetromino(-1, 0);
        } else {
          moveTetromino(1, 0);
        }
      } else {
        if (diffY < 0) {
          moveTetromino(0, 1);
        }
      }
    }

    // Prevent scrolling when touching the canvas
    document.body.addEventListener(
      "touchstart",
      function (e) {
        if (e.target.id === "game-board") {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    document.body.addEventListener(
      "touchend",
      function (e) {
        if (e.target.id === "game-board") {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    document.body.addEventListener(
      "touchmove",
      function (e) {
        if (e.target.id === "game-board") {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }

  // Initialize game
  window.addEventListener("resize", () => {
    updateBoardDimensions();
    if (gameState.gameStarted) {
      updateGame();
    }
  });

  updateBoardDimensions();
  initializeBoard();
}

function App() {
  onMount(init);

  return (
    <div id="game-container">
      <div id="score">Score: 0</div>
      <div id="game-board" class="no-select"></div>
      <div id="button-container" class="no-select">
        <button id="start-button" class="button">
          Start Game
        </button>
        <button id="reset-button" class="button" style="display: none">
          Reset
        </button>
        <button id="pause-button" class="button" style="display: none">
          Pause Game
        </button>
      </div>
    </div>
  );
}

export default App;
