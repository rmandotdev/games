const GG_ALL_GAME_CONFIG = {
	baseColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500']
};

let gameState = {
	gridSize: 4,
	pattern: [],
	grid: [],
	bestTimes: {},
	startTime: 0,
	currentTime: 0,
	isPlaying: false,
	isPaused: false,
	pausedTime: 0,
	colors: [],
};

function saveData() {
	localStorage.setItem('pixel-puzzle-rush-data', JSON.stringify({bestTimes: gameState.bestTimes}));
}

function loadData() {
	gameState.bestTimes = JSON.parse(localStorage.getItem('pixel-puzzle-rush-data') ?? '{}')?.bestTimes ?? {};
}

const settingsElement = document.getElementById('settings');
const timerElement = document.getElementById('timer');
const bestTimeElement = document.getElementById('best-time');
const patternElement = document.getElementById('pattern');
const gridElement = document.getElementById('grid');
const messageElement = document.getElementById('message');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const cancelButton = document.getElementById('cancel');
const menuButton = document.getElementById('menu-button');

function initializeGame() {
	gameState.pattern = generateRandomGrid();
	gameState.grid = generateRandomGrid();
	renderGrid(patternElement, gameState.pattern);
	renderGrid(gridElement, gameState.grid);
	updateBestTime();
}

function updateGameConfig() {
	gameState.gridSize = parseInt(document.getElementById('grid-size').value);
	const colorCount = parseInt(document.getElementById('color-count').value);
	gameState.colors = generateColors(colorCount);
}

function generateColors(count) {
	return GG_ALL_GAME_CONFIG.baseColors.slice(0, count);
}

function generateRandomGrid() {
	return Array.from({
			length: gameState.gridSize * gameState.gridSize
		}, () =>
		gameState.colors[Math.floor(Math.random() * gameState.colors.length)]
	);
}

function renderGrid(element, grid) {
	element.style.gridTemplateColumns = `repeat(${gameState.gridSize}, 1fr)`;
	element.innerHTML = grid.map((color, index) =>
		`<div class="pixel" style="background-color:${color};" data-index="${index}"></div>`
	).join('');
}

function updateBestTime() {
	const key = `${gameState.gridSize}x${gameState.gridSize}-${gameState.colors.length}`;
	const bestTime = gameState.bestTimes[key] || Infinity;
	bestTimeElement.textContent = (bestTime === Infinity ? `Best Time (${key}): None` : `Best Time (${key}): ${(bestTime / 1000).toFixed(2)}s`);
}

function startTimer() {
	gameState.timerInterval = setInterval(() => {
		if (!gameState.isPlaying || gameState.isPaused) {
			return;
		}
		gameState.currentTime = Date.now() - gameState.startTime;
		timerElement.textContent = `Time: ${(gameState.currentTime / 1000).toFixed(2)}s`;
	}, 10);
}

function checkMatch() {
	if (gameState.grid.every((color, index) => color === gameState.pattern[index])) {
		endGame();
	}
}

function startGame() {
	updateGameConfig();

	gameState.isPlaying = true;
	gameState.isPaused = false;
	gameState.startTime = Date.now() - gameState.pausedTime;
	gameState.currentTime = gameState.pausedTime;

	initializeGame();
	startTimer();

	pauseButton.textContent = 'Pause';
	settingsElement.style.display = 'none';

	timerElement.style.display = 'block';
	bestTimeElement.style.display = 'block';

	patternElement.style.visibility = 'visible';
	gridElement.style.visibility = 'visible';

	patternElement.style.display = 'inline-grid';
	gridElement.style.display = 'inline-grid';

	messageElement.style.display = 'none';

	startButton.style.display = 'none';
	pauseButton.style.display = 'flex';
	cancelButton.style.display = 'flex';
	menuButton.style.display = 'none';
}

function pauseGame() {
	if (gameState.isPaused) {
		gameState.isPaused = false;
		gameState.startTime = Date.now() - gameState.currentTime;
		startTimer();

		pauseButton.textContent = 'Pause';
		patternElement.style.visibility = 'visible';
		gridElement.style.visibility = 'visible';
	} else {
		gameState.isPaused = true;
		clearInterval(gameState.timerInterval);

		pauseButton.textContent = 'Resume';
		patternElement.style.visibility = 'hidden';
		gridElement.style.visibility = 'hidden';
	}
}

function cancelGame() {
	gameState.isPlaying = false;
	gameState.isPaused = false;

	clearInterval(gameState.timerInterval);

	showMenu();
}

function endGame() {
	gameState.isPlaying = false;
	gameState.isPaused = false;

	clearInterval(gameState.timerInterval);
	const key = `${gameState.gridSize}x${gameState.gridSize}-${gameState.colors.length}`;
	if (!gameState.bestTimes[key] || gameState.currentTime < gameState.bestTimes[key]) {
		gameState.bestTimes[key] = gameState.currentTime;
		updateBestTime();
		saveData();
		messageElement.textContent = `New Best Time for ${key}: ${(gameState.currentTime / 1000).toFixed(2)}s!`;
	} else {
		messageElement.textContent = `Puzzle Solved! Time: ${(gameState.currentTime / 1000).toFixed(2)}s`;
	}

	messageElement.style.display = 'block';

	startButton.style.display = 'flex';
	pauseButton.style.display = 'none';
	cancelButton.style.display = 'none';
	menuButton.style.display = 'flex';
}

function showMenu() {
	settingsElement.style.display = 'flex';

	timerElement.style.display = 'none';
	bestTimeElement.style.display = 'none';

	patternElement.style.display = 'none';
	gridElement.style.display = 'none';

	messageElement.style.display = 'none';

	startButton.style.display = 'flex';
	pauseButton.style.display = 'none';
	cancelButton.style.display = 'none';
	menuButton.style.display = 'none';
}

gridElement.addEventListener('click', (e) => {
	if (!gameState.isPlaying || gameState.isPaused) return;
	const index = e.target.dataset.index;
	if (index !== undefined) {
		const nextColorIndex = (gameState.colors.indexOf(gameState.grid[index]) + 1) % gameState.colors.length;
		gameState.grid[index] = gameState.colors[nextColorIndex];
		e.target.style.backgroundColor = gameState.grid[index];
		checkMatch();
	}
});

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
cancelButton.addEventListener('click', cancelGame);
menuButton.addEventListener('click', showMenu);

document.getElementById('grid-size').addEventListener('change', updateBestTime);
document.getElementById('color-count').addEventListener('change', updateBestTime);

loadData();
updateGameConfig();
showMenu();
