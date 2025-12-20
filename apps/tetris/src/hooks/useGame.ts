import { createSignal } from "solid-js";

import { randomInt } from "~/lib/randomInt";

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
  tetrominoShapes: TetrmoinoShape[];
};

type CurrentTetromino = {
  shape: Shape;
  x: number;
  y: number;
  color: string;
  colorIndex: number;
};

type State = "notstarted" | "ongoing" | "paused";

const CONFIG = {
  boardWidth: 10,
  boardHeight: 20,

  initialSpeed: 1000,
  speedIncrease: 50,

  scorePerLine: 100,

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
} as const satisfies GameConfig;

function createEmptyBoard(): number[][] {
  const board: number[][] = Array(CONFIG.boardHeight)
    .fill(null)
    .map(() => Array(CONFIG.boardWidth).fill(0));

  return board;
}

export function useGame() {
  const [state, setState] = createSignal<State>("notstarted");
  const [score, setScore] = createSignal<number>(0);

  const [gameBoard, setGameBoard] = createSignal<number[][]>(
    createEmptyBoard(),
  );
  const [currentTetromino, setCurrentTetromino] =
    createSignal<CurrentTetromino | null>(null);

  const getProjection = (): number[][] => {
    const board = structuredClone(gameBoard());
    const tetromino = currentTetromino();

    if (!tetromino) return board;

    tetromino.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 0) return;
        if (board[tetromino.y + y]?.[tetromino.x + x] !== undefined) {
          board[tetromino.y + y]![tetromino.x + x] = tetromino.colorIndex + 1;
        }
      });
    });

    return board;
  };

  let gameIntervalId: number | undefined = undefined;

  function increaseSpeed(
    gameIntervalId: number | undefined,
    gameLoop: () => void,
  ) {
    window.clearInterval(gameIntervalId);

    const newSpeed =
      CONFIG.initialSpeed - Math.floor(score() / 1000) * CONFIG.speedIncrease;

    const speedDelay = Math.max(100, newSpeed);

    return window.setInterval(gameLoop, speedDelay);
  }

  function createTetromino(): CurrentTetromino {
    const shapeIndex = randomInt(CONFIG.tetrominoShapes.length);
    const tetrominoData = CONFIG.tetrominoShapes[shapeIndex];

    return {
      shape: JSON.parse(JSON.stringify(tetrominoData.shape)) as Shape,
      x:
        Math.floor(CONFIG.boardWidth / 2) -
        Math.floor(tetrominoData.shape[0]!.length / 2),
      y: 0,
      color: tetrominoData.color,
      colorIndex: shapeIndex,
    };
  }

  function collision(): boolean {
    const tetromino = currentTetromino();

    if (!tetromino) return false;

    return tetromino.shape.some((row, dy) =>
      row.some((value, dx) => {
        if (value === 0) return false;

        const newY = tetromino.y + dy;
        const newX = tetromino.x + dx;

        return (
          newY >= CONFIG.boardHeight ||
          newX < 0 ||
          newX >= CONFIG.boardWidth ||
          (newY >= 0 && gameBoard()[newY]![newX])
        );
      }),
    );
  }

  function gameOver() {
    window.clearInterval(gameIntervalId);
    alert(`Game Over! Your score: ${score()}`);
    setState("notstarted");
  }

  function initializeBoard(): void {
    setGameBoard(createEmptyBoard());
  }

  function mergeTetromino(): void {
    const tetromino = currentTetromino();

    if (!tetromino) return;

    tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value) return;

        const newY = tetromino.y + y;
        const newX = tetromino.x + x;

        const inBoundaries =
          newY >= 0 &&
          newY < CONFIG.boardHeight &&
          newX >= 0 &&
          newX < CONFIG.boardWidth;

        if (!inBoundaries) return;

        const board = window.structuredClone(gameBoard());
        board[newY]![newX] = tetromino.colorIndex + 1;
        setGameBoard(board);
      });
    });
  }

  function checkLines() {
    let linesCleared = 0;

    const board = window.structuredClone(gameBoard());

    for (let y = CONFIG.boardHeight - 1; y >= 0; y--) {
      if (board[y]!.every((cell) => cell !== 0)) {
        linesCleared++;
        board.splice(y, 1);
        board.unshift(Array(CONFIG.boardWidth).fill(0));
        y++;
      }
    }

    setGameBoard(board);

    if (linesCleared === 0) return;

    setScore(score() + linesCleared * CONFIG.scorePerLine);
    gameIntervalId = increaseSpeed(gameIntervalId, gameLoop);
  }

  function moveTetromino(dx: -1 | 0 | 1, dy: 0 | 1): void {
    const tetromino = currentTetromino();

    if (!tetromino) return;

    setCurrentTetromino({
      ...tetromino,
      x: tetromino.x + dx,
      y: tetromino.y + dy,
    });

    if (collision()) {
      setCurrentTetromino(tetromino);

      if (dy === 0) return;

      mergeTetromino();
      checkLines();

      setCurrentTetromino(createTetromino());

      if (collision()) {
        gameOver();
      }
    }
  }

  function gameLoop() {
    if (state() !== "ongoing") return;

    moveTetromino(0, 1);
  }

  function startGame() {
    if (state() !== "notstarted") return;

    initializeBoard();
    setScore(0);
    setCurrentTetromino(createTetromino());

    gameIntervalId = window.setInterval(gameLoop, CONFIG.initialSpeed);

    setState("ongoing");
  }

  function pauseGame() {
    const currentState = state();

    if (currentState !== "paused" && currentState !== "ongoing") return;

    if (currentState === "paused") {
      gameIntervalId = window.setInterval(gameLoop, CONFIG.initialSpeed);
      setState("ongoing");
    } else if (currentState === "ongoing") {
      window.clearInterval(gameIntervalId);
      setState("paused");
    }
  }

  function resumeGame() {
    const currentState = state();

    if (currentState !== "paused" && currentState !== "ongoing") return;

    if (currentState === "paused") {
      gameIntervalId = window.setInterval(gameLoop, CONFIG.initialSpeed);
      setState("ongoing");
    } else if (currentState === "ongoing") {
      window.clearInterval(gameIntervalId);
      setState("paused");
    }
  }

  function resetGame() {
    const message = `Are you sure you want to reset the game? Your current progress will be lost.`;

    if (!confirm(message)) return;

    window.clearInterval(gameIntervalId);

    setState("notstarted");

    initializeBoard();
    setScore(0);
    setCurrentTetromino(null);
  }

  function rotateTetromino() {
    const tetromino = currentTetromino();

    if (!tetromino) return;

    const rotated = tetromino.shape[0]!.map((_, index) =>
      tetromino.shape.map((row) => row[index]!).reverse(),
    );

    const previousShape = tetromino.shape;

    setCurrentTetromino({ ...tetromino, shape: rotated });

    if (collision()) {
      setCurrentTetromino({ ...tetromino, shape: previousShape });
    }
  }

  function updateBoardDimensions(): void {
    const blockSize = 40;

    const newWidth = CONFIG.boardWidth * blockSize;
    const newHeight = CONFIG.boardHeight * blockSize;

    const documentStyle = document.documentElement.style;

    documentStyle.setProperty("--board-width", `${newWidth}px`);
    documentStyle.setProperty("--board-height", `${newHeight}px`);
    documentStyle.setProperty("--block-size", `${blockSize}px`);
    documentStyle.setProperty(
      "--grid-columns",
      `repeat(${CONFIG.boardWidth}, 1fr)`,
    );
    documentStyle.setProperty(
      "--grid-rows",
      `repeat(${CONFIG.boardHeight}, 1fr)`,
    );
  }

  const init = () => {
    updateBoardDimensions();

    document.addEventListener("keydown", (e) => {
      if (state() !== "ongoing") return;

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
  };

  return {
    init,
    score,
    state,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    moveTetromino,
    getProjection,
  };
}
