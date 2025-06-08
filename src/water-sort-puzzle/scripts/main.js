const CONFIG = {
  dataUrl:
    "https://bypasser.gameroman.workers.dev/api/v1/gitlab.com/gameroman/water-sort-puzzle/-/raw/main/data",
  finalMessage: "Congratulations! You completed all levels!",
  tubeCapacity: 4, // Maximum number of liquid units per tube
  colors: [
    "#FF0000",
    "#0000FF",
    "#20D020",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#A200FF",
  ], // Array of liquid colors
  levels: [],
};

let gameState = {
  currentLevel: 0, // Current level index
  tubes: [],
  selectedTube: null,
};

function saveData() {
  localStorage.setItem(
    "water-sort-puzzle-data",
    JSON.stringify({
      currentLevel: gameState.currentLevel,
    })
  );
}

function loadData() {
  const data = localStorage.getItem("water-sort-puzzle-data");
  if (data) {
    gameState.currentLevel = JSON.parse(data)?.currentLevel ?? 0;
  } else {
    gameState.currentLevel = 0;
  }
  document.getElementById("currrent-level").textContent = `Level ${
    gameState.currentLevel + 1
  }`;
}

async function getLevels() {
  await fetch(
    `${CONFIG.dataUrl}/levels.json?timestamp=${Date.now()}`
  )
    .then((response) => response.json())
    .then((data) => {
      CONFIG.levels = data;
    });
}

async function getFinalMessage() {
  const response = await fetch(
    `${CONFIG.dataUrl}/finalmessage.html?timestamp=${Date.now()}`
  );
  CONFIG.finalMessage = await response.text();
}

function createTubes() {
  const tubesContainer = document.getElementById("tubes-container");
  tubesContainer.innerHTML = "";
  gameState.tubes = JSON.parse(
    JSON.stringify(CONFIG.levels[gameState.currentLevel])
  );
  const tubeCount = gameState.tubes.length;
  let rowCount = 1;
  if (tubeCount > 15) {
    rowCount = 3;
  } else if (tubeCount > 7) {
    rowCount = 2;
  }
  const tubesPerRow = Math.ceil(tubeCount / rowCount);
  for (let i = 0; i < rowCount; i++) {
    const row = document.createElement("div");
    row.className = "tube-row";
    for (let j = 0; j < tubesPerRow && i * tubesPerRow + j < tubeCount; j++) {
      const tube = document.createElement("div");
      tube.className = "tube";
      tube.onclick = () => selectTube(i * tubesPerRow + j);
      row.appendChild(tube);
    }
    tubesContainer.appendChild(row);
  }
}

function loadLevel() {
  document.getElementById("restart-level").disabled = true;
  if (gameState.currentLevel >= CONFIG.levels.length) {
    document.getElementById("tubes-container").style.visibility = "hidden";
    document.getElementById("message").innerHTML =
      CONFIG.finalMessage;
    return;
  }
  createTubes();
  renderTubes();
  document.getElementById("currrent-level").textContent = `Level ${
    gameState.currentLevel + 1
  }`;
  document.getElementById("previous-level").disabled =
    gameState.currentLevel === 0;
  document.getElementById("next-level").disabled =
    gameState.currentLevel === CONFIG.levels.length - 1;
}

function renderTubes() {
  updateTubeSize();
  gameState.tubes.forEach((tube, index) => {
    const tubeElement = document.getElementsByClassName("tube")[index];
    tubeElement.innerHTML = "";
    tube.forEach((colorIndex) => {
      const liquid = document.createElement("div");
      liquid.className = "liquid";
      liquid.style.backgroundColor = CONFIG.colors[colorIndex];
      tubeElement.appendChild(liquid);
    });
  });
}

function selectTube(index) {
  if (gameState.selectedTube === null) {
    if (gameState.tubes[index].length > 0) {
      gameState.selectedTube = index;
      document.getElementsByClassName("tube")[index].style.border =
        "2px solid #FFD700";
    }
  } else {
    if (canPour(gameState.selectedTube, index)) {
      pourLiquid(gameState.selectedTube, index);
      checkWin();
    }
    document.getElementsByClassName("tube")[
      gameState.selectedTube
    ].style.border = "2px solid #000";
    gameState.selectedTube = null;
  }
}

function canPour(from, to) {
  if (from === to) return false;
  if (gameState.tubes[from].length === 0) return false;
  if (gameState.tubes[to].length === CONFIG.tubeCapacity)
    return false;
  if (gameState.tubes[to].length === 0) return true;
  return (
    gameState.tubes[from][gameState.tubes[from].length - 1] ===
    gameState.tubes[to][gameState.tubes[to].length - 1]
  );
}

function pourLiquid(from, to) {
  const colorToPour = gameState.tubes[from][gameState.tubes[from].length - 1];
  while (
    gameState.tubes[from].length > 0 &&
    gameState.tubes[to].length < CONFIG.tubeCapacity &&
    gameState.tubes[from][gameState.tubes[from].length - 1] === colorToPour
  ) {
    gameState.tubes[to].push(gameState.tubes[from].pop());
  }
  document.getElementById("restart-level").disabled = false;
  renderTubes();
}

function checkWin() {
  const win = gameState.tubes.every(
    (tube) =>
      tube.length === 0 ||
      (tube.length === CONFIG.tubeCapacity &&
        tube.every((color) => color === tube[0]))
  );
  if (win) {
    gameState.currentLevel++;
    saveData();
    loadLevel();
  }
}

function updateTubeSize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const tubesCount = gameState.tubes.length;
  let rowCount = 1;
  if (tubesCount > 15) {
    rowCount = 3;
  } else if (tubesCount > 7) {
    rowCount = 2;
  }
  const tubesPerRow = Math.ceil(tubesCount / rowCount);
  // Calculate new sizes based on window width and number of tubes per row
  let newTubeWidth = Math.min(90, windowWidth / tubesPerRow - 90 / 4);
  let newTubeHeight = newTubeWidth * 3.5; // Maintain aspect ratio
  let newTubesGap = newTubeWidth / 4;
  let newTubeBorderRadius = newTubeWidth / 3;
  // Ensure the tubes fit vertically
  const totalHeight = (newTubeHeight + 2 * newTubesGap) * rowCount;
  if (totalHeight > windowHeight * 0.8) {
    const scale = (windowHeight * 0.8) / totalHeight;
    newTubeWidth *= scale;
    newTubeHeight *= scale;
    newTubesGap *= scale;
    newTubeBorderRadius *= scale;
  }
  // Ensure minimum sizes
  newTubeWidth = Math.max(40, newTubeWidth);
  newTubeHeight = newTubeWidth * 3.5;
  newTubesGap = newTubeWidth / 4;
  newTubeBorderRadius = newTubeWidth / 3;
  // Update CSS variables
  document.documentElement.style.setProperty(
    "--tube-width",
    `${newTubeWidth}px`
  );
  document.documentElement.style.setProperty(
    "--tube-height",
    `${newTubeHeight}px`
  );
  document.documentElement.style.setProperty("--tubes-gap", `${newTubesGap}px`);
  document.documentElement.style.setProperty(
    "--tube-border-radius",
    `${newTubeBorderRadius}px`
  );
  // Update top menu sizes based on window width
  const newTopMenuFontSize = Math.max(16, Math.min(36, windowWidth * 0.09));
  const newControlButtonSize = Math.max(24, Math.min(54, windowWidth * 0.12));
  const newTopMenuGap = Math.max(10, Math.min(20, windowWidth * 0.04));
  document.documentElement.style.setProperty(
    "--top-menu-font-size",
    `${newTopMenuFontSize}px`
  );
  document.documentElement.style.setProperty(
    "--control-button-size",
    `${newControlButtonSize}px`
  );
  document.documentElement.style.setProperty(
    "--top-menu-gap",
    `${newTopMenuGap}px`
  );
}

window.addEventListener("resize", updateTubeSize);

document.getElementById("restart-level").addEventListener("click", loadLevel);
document.getElementById("previous-level").addEventListener("click", () => {
  if (gameState.currentLevel > 0) {
    gameState.currentLevel--;
    saveData();
    loadLevel();
  }
});
document.getElementById("next-level").addEventListener("click", () => {
  if (gameState.currentLevel < CONFIG.levels.length - 1) {
    gameState.currentLevel++;
    saveData();
    loadLevel();
  }
});

// Initialize the game
async function initializeGame() {
  getFinalMessage();
  loadData();
  await getLevels();
  loadLevel();
}

initializeGame();
updateTubeSize(); // Initial call to set correct sizes
