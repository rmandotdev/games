type MainPiece = {
  type: "main";
  size: { w: 2; h: 1 };
  pos: { x: number; y: 2 };
};

type VerticalPiece = {
  type: "vertical";
  size: { w: 1; h: 2 | 3 };
  pos: { x: number; y: number };
};

type HorizontalPiece = {
  type: "horizontal";
  size: { w: 2 | 3; h: 1 };
  pos: { x: number; y: number };
};

type Piece = MainPiece | VerticalPiece | HorizontalPiece;

const CONFIG = {
  gridSize: 6, // Size of the grid (6x6)
  cellSize: 50, // Size of each cell in pixels
  exitPosition: 2, // Position of the exit hole (0-indexed)
  currentLevel: 1, // Current level number
  nextLevel: 1, // Number of levels solved
  totalLevels: 10, // Total number of levels in the game
  darkMode: false, // Dark mode state
  pieces: [] as Piece[],
  levels: [
    // Level 1
    [
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 0, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 1, y: 0 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 3, y: 0 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 3, y: 3 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 0, y: 4 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 4, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 0, y: 0 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 5, y: 0 } },
    ],
    [
      // Level 2
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 0, y: 2 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 1, y: 3 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 0, y: 1 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 3, y: 2 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 5, y: 0 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 0, y: 0 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 2, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 2, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 2, y: 4 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 4, y: 1 } },
    ],
    [
      // Level 3
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 1, y: 2 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 2, y: 5 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 0, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 2, y: 3 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 3, y: 0 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 3, y: 3 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 5, y: 4 } },
    ],
    [
      // Level 4
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 1, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 1, y: 4 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 3, y: 2 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 1, y: 3 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 2, y: 5 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 5, y: 3 } },
    ],
    [
      // Level 5
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 0, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 1, y: 3 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 0, y: 5 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 2, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 2, y: 4 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 3, y: 2 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 1, y: 1 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 1, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 4, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 5, y: 1 } },
    ],
    [
      // Level 6
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 0, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 1, y: 3 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 4, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 2, y: 1 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 0, y: 3 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 3, y: 1 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 2, y: 3 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 2, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 1, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 5, y: 1 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 4, y: 1 } },
    ],
    [
      // Level 7
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 0, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 1, y: 4 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 4, y: 1 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 2, y: 1 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 0, y: 4 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 3, y: 0 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 0, y: 3 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 1, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 0, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 5, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 3, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 2, y: 4 } },
    ],
    [
      // Level 8
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 0, y: 2 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 4, y: 1 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 1, y: 4 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 0, y: 3 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 0, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 5, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 3, y: 2 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 4, y: 4 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 3, y: 5 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 1, y: 1 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 2, y: 0 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 4, y: 0 } },
    ],
    [
      // Level 9
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 0, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 1, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 5, y: 1 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 2, y: 3 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 2, y: 0 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 0, y: 3 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 1, y: 3 } },
      { type: "vertical", size: { w: 1, h: 3 }, pos: { x: 3, y: 0 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 4, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 4, y: 3 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 5, y: 3 } },
    ],
    [
      // Level 10
      { type: "main", size: { w: 2, h: 1 }, pos: { x: 1, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 5, y: 2 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 4, y: 0 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 3, y: 2 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 4, y: 2 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 0, y: 3 } },
      { type: "horizontal", size: { w: 3, h: 1 }, pos: { x: 1, y: 4 } },
      { type: "vertical", size: { w: 1, h: 2 }, pos: { x: 0, y: 4 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 1, y: 0 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 4, y: 1 } },
      { type: "horizontal", size: { w: 2, h: 1 }, pos: { x: 4, y: 4 } },
    ],
  ] as Piece[][],
};

function deepCopy<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const copy = (Array.isArray(obj) ? [] : {}) as T;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }
  return copy;
}

const gameContainer = document.getElementById(
  "game-container",
) as HTMLDivElement;
const menuContainer = document.getElementById(
  "menu-container",
) as HTMLDivElement;
const gameUI = document.getElementById("game-ui") as HTMLDivElement;
const mainMenu = document.getElementById("game-main-menu") as HTMLDivElement;
const mainMenuButton = document.getElementById(
  "main-menu-button",
) as HTMLButtonElement;
const darkModeToggle = document.getElementById(
  "dark-mode-toggle",
) as HTMLButtonElement;
const closeSettingsButton = document.getElementById(
  "close-settings",
) as HTMLButtonElement;

function startLevel() {
  menuContainer.style.display = "none";
  gameUI.style.display = "block";
  gameContainer.innerHTML = "";
  mainMenu.innerHTML = `
<button id="main-menu-button" class="menu-button">MAIN MENU</button>
`;

  mainMenuButton.addEventListener("click", showMainMenu);
  CONFIG.pieces = getLevelPieces(CONFIG.currentLevel);
  createPieces();
  createExit();
  updateLevelDisplay();
}

function resizeGame() {
  const containerSize = Math.min(
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
    300,
  );
  gameContainer.style.width = `${containerSize}px`;
  gameContainer.style.height = `${containerSize}px`;
  CONFIG.cellSize = containerSize / CONFIG.gridSize;
  const pieces = document.querySelectorAll<HTMLElement>(".piece");
  pieces.forEach((piece, index) => {
    const pieceData = CONFIG.pieces[index]!;
    piece.style.width = `${pieceData.size.w * CONFIG.cellSize}px`;
    piece.style.height = `${pieceData.size.h * CONFIG.cellSize}px`;
    piece.style.left = `${pieceData.pos.x * CONFIG.cellSize}px`;
    piece.style.top = `${pieceData.pos.y * CONFIG.cellSize}px`;
  });
  const exit = document.getElementById("exit");
  if (exit) {
    exit.style.top = `${CONFIG.exitPosition * CONFIG.cellSize}px`;
  }
}

window.addEventListener("resize", resizeGame);

function getLevelPieces(level: number): Piece[] {
  return deepCopy(CONFIG.levels[level - 1]!);
}

type SelectedPiece = HTMLElement;

let selectedPiece: SelectedPiece | null = null;
let startX: number;
let startY: number;

function updateLevelDisplay() {
  const levelDisplay = document.getElementById("level-display");
  if (levelDisplay) {
    levelDisplay.textContent = `Level ${CONFIG.currentLevel}`;
  }
}

function createPieces() {
  CONFIG.pieces.forEach((piece, index) => {
    const pieceElement = document.createElement("div");
    pieceElement.className = "piece";
    if (piece.type === "main") {
      pieceElement.id = "main-piece";
    } else if (piece.type === "horizontal") {
      pieceElement.classList.add("horizontal-piece");
    } else if (piece.type === "vertical") {
      pieceElement.classList.add("vertical-piece");
    }
    pieceElement.style.width = `${piece.size.w * CONFIG.cellSize}px`;
    pieceElement.style.height = `${piece.size.h * CONFIG.cellSize}px`;
    pieceElement.style.left = `${piece.pos.x * CONFIG.cellSize}px`;
    pieceElement.style.top = `${piece.pos.y * CONFIG.cellSize}px`;
    pieceElement.textContent = piece.type === "main" ? "Exit" : "";
    pieceElement.dataset.index = `${index}`;
    gameContainer.appendChild(pieceElement);
  });
}

function createExit() {
  const exit = document.createElement("div");
  exit.id = "exit";
  exit.style.top = `${CONFIG.exitPosition * CONFIG.cellSize}px`;
  gameContainer.appendChild(exit);
}

function checkWin() {
  const mainPieceRect = document
    .getElementById("main-piece")
    .getBoundingClientRect();
  const mainPieceRightEdge = mainPieceRect.left + mainPieceRect.width;
  const exitRect = document.getElementById("exit").getBoundingClientRect();
  if (mainPieceRightEdge >= exitRect.left) {
    showLevelComplete();
  }
}

function showLevelComplete() {
  if (CONFIG.currentLevel < CONFIG.totalLevels) {
    menuContainer.innerHTML = `
<h2>Level ${CONFIG.currentLevel} Complete!</h2>
<div class="button-container">
<button id="next-level" class="menu-button">NEXT LEVEL</button>
<button id="main-menu" class="menu-button">MAIN MENU</button>
</div>
`;
    document.getElementById("next-level").addEventListener("click", nextLevel);
  } else {
    menuContainer.innerHTML = `
<h2>Congratulations!</h2>
<h2>You've completed all levels!</h2>
<div class="button-container">
<button id="main-menu" class="menu-button">MAIN MENU</button>
</div>
`;
  }
  menuContainer.style.display = "flex";
  menuContainer.style.flexDirection = "column";
  menuContainer.style.alignItems = "center";
  gameUI.style.display = "none";
  document.getElementById("main-menu").addEventListener("click", showMainMenu);
}

function nextLevel() {
  CONFIG.currentLevel++;
  startLevel();
}

function showMainMenu() {
  menuContainer.innerHTML = "";
  for (let i = 1; i <= CONFIG.totalLevels; i++) {
    const button = document.createElement("button");
    button.id = `level-${i}`;
    button.className = "menu-button";
    button.textContent = `Level ${i}`;
    button.addEventListener("click", function () {
      CONFIG.currentLevel = i;
      startLevel();
    });
    menuContainer.appendChild(button);
  }
  const settingsButton = document.createElement("button");
  settingsButton.id = "settings-button";
  settingsButton.innerHTML = "⚙️";
  settingsButton.title = "Settings";
  settingsButton.addEventListener("click", showSettings);
  menuContainer.appendChild(settingsButton);
  menuContainer.style.display = "grid";
  gameUI.style.display = "none";
}

function showSettings() {
  const settingsPopup = document.getElementById("settings-popup");
  settingsPopup.style.display = "block";
}

function closeSettings() {
  const settingsPopup = document.getElementById("settings-popup");
  settingsPopup.style.display = "none";
}

function toggleDarkMode() {
  CONFIG.darkMode = !CONFIG.darkMode;
  document.body.classList.toggle("dark-mode", CONFIG.darkMode);
}

function canMove(piece: SelectedPiece, newX: number, newY: number) {
  const pieceIndex = parseInt(piece.dataset.index);
  const pieceData = CONFIG.pieces[pieceIndex]!;
  const isHorizontal =
    pieceData.type === "main" || pieceData.type === "horizontal";
  const isVertical = pieceData.type === "vertical";
  if (
    (isHorizontal && newY !== pieceData.pos.y * CONFIG.cellSize) ||
    (isVertical && newX !== pieceData.pos.x * CONFIG.cellSize)
  ) {
    return false;
  }
  const newGridX = newX / CONFIG.cellSize;
  const newGridY = newY / CONFIG.cellSize;
  if (
    newGridX < 0 ||
    newGridY < 0 ||
    newGridX + pieceData.size.w > CONFIG.gridSize ||
    newGridY + pieceData.size.h > CONFIG.gridSize
  ) {
    return false;
  }
  for (let i = 0; i < CONFIG.pieces.length; i++) {
    if (i !== pieceIndex) {
      const otherPiece = CONFIG.pieces[i]!;
      if (
        newGridX < otherPiece.pos.x + otherPiece.size.w &&
        newGridX + pieceData.size.w > otherPiece.pos.x &&
        newGridY < otherPiece.pos.y + otherPiece.size.h &&
        newGridY + pieceData.size.h > otherPiece.pos.y
      ) {
        return false;
      }
    }
  }
  return true;
}

function handleStart(e: TouchEvent) {
  const touch = e.touches[0]!;
  selectedPiece = (e.target as HTMLDivElement).closest(".piece");
  if (selectedPiece) {
    startX = touch.clientX - selectedPiece.offsetLeft;
    startY = touch.clientY - selectedPiece.offsetTop;
  }
}

function handleMove(e: TouchEvent) {
  if (selectedPiece) {
    e.preventDefault();
    const touch = e.touches[0]!;
    checkWin();
    const newX =
      Math.round((touch.clientX - startX) / CONFIG.cellSize) * CONFIG.cellSize;
    const newY =
      Math.round((touch.clientY - startY) / CONFIG.cellSize) * CONFIG.cellSize;
    if (canMove(selectedPiece, newX, newY)) {
      selectedPiece.style.left = `${newX}px`;
      selectedPiece.style.top = `${newY}px`;
    }
  }
}

function handleEnd() {
  if (selectedPiece) {
    const pieceIndex = parseInt(selectedPiece.dataset.index);
    const newX = Math.round(selectedPiece.offsetLeft / CONFIG.cellSize);
    const newY = Math.round(selectedPiece.offsetTop / CONFIG.cellSize);
    if (
      newX !== CONFIG.pieces[pieceIndex].pos.x ||
      newY !== CONFIG.pieces[pieceIndex].pos.y
    ) {
      CONFIG.pieces[pieceIndex].pos = { x: newX, y: newY };
      checkWin();
    }
    selectedPiece.style.left = `${newX * CONFIG.cellSize}px`;
    selectedPiece.style.top = `${newY * CONFIG.cellSize}px`;
    selectedPiece = null;
  }
}

gameContainer.addEventListener("mousedown", (e) => {
  selectedPiece = (e.target as HTMLDivElement).closest(".piece");
  if (selectedPiece) {
    startX = e.clientX - selectedPiece.offsetLeft;
    startY = e.clientY - selectedPiece.offsetTop;
  }
});

window.addEventListener("mousemove", (e) => {
  if (selectedPiece) {
    checkWin();
    const newX =
      Math.round((e.clientX - startX) / CONFIG.cellSize) * CONFIG.cellSize;
    const newY =
      Math.round((e.clientY - startY) / CONFIG.cellSize) * CONFIG.cellSize;
    if (canMove(selectedPiece, newX, newY)) {
      selectedPiece.style.left = `${newX}px`;
      selectedPiece.style.top = `${newY}px`;
    }
  }
});

window.addEventListener("mouseup", handleEnd);

gameContainer.addEventListener("touchstart", handleStart, { passive: false });
gameContainer.addEventListener("touchmove", handleMove, { passive: false });
gameContainer.addEventListener("touchend", handleEnd, { passive: false });

darkModeToggle.addEventListener("change", toggleDarkMode);
closeSettingsButton.addEventListener("click", closeSettings);

showMainMenu();
resizeGame();

export {};
