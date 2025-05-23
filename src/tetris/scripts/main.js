let GG_ALL_GAME_CONFIG = {
	boardWidth: 10,
	boardHeight: 20,
	initialSpeed: 1000,
	speedIncrease: 50,
	scorePerLine: 100,
	minBlockSize: 15,
	tetrominoShapes: [
		{
			shape: [[1, 1, 1, 1]],
			color: 'var(--tetromino-color-0)'
		},
		{
			shape: [[1, 1], [1, 1]],
			color: 'var(--tetromino-color-1)'
		},
		{
			shape: [[1, 1, 1], [0, 1, 0]],
			color: 'var(--tetromino-color-2)'
		},
		{
			shape: [[1, 1, 1], [1, 0, 0]],
			color: 'var(--tetromino-color-3)'
		},
		{
			shape: [[1, 1, 1], [0, 0, 1]],
			color: 'var(--tetromino-color-4)'
		},
		{
			shape: [[1, 1, 0], [0, 1, 1]],
			color: 'var(--tetromino-color-5)'
		},
		{
			shape: [[0, 1, 1], [1, 1, 0]],
			color: 'var(--tetromino-color-6)'
		}
	]
};

let gameBoard = [];
let currentTetromino;
let score = 0;
let gameInterval;
let gameStarted = false;
let gamePaused = false;

const gameboardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');

function updateBoardDimensions() {
	const gameboardElement = document.getElementById('game-board');
	const containerElement = document.getElementById('game-container');
	const maxWidth = containerElement.clientWidth * 0.95;
	const maxHeight = window.innerHeight - 120;
	const blockSize = Math.max(
		GG_ALL_GAME_CONFIG.minBlockSize,
		Math.min(
			(maxWidth / GG_ALL_GAME_CONFIG.boardWidth),
			(maxHeight / GG_ALL_GAME_CONFIG.boardHeight)
		)
	);
	const newWidth = GG_ALL_GAME_CONFIG.boardWidth * blockSize;
	const newHeight = GG_ALL_GAME_CONFIG.boardHeight * blockSize;
	document.documentElement.style.setProperty('--board-width', `${newWidth}px`);
	document.documentElement.style.setProperty('--board-height', `${newHeight}px`);
	document.documentElement.style.setProperty('--block-size', `${blockSize}px`);
	document.documentElement.style.setProperty('--grid-columns', `repeat(${GG_ALL_GAME_CONFIG.boardWidth}, 1fr)`);
	document.documentElement.style.setProperty('--grid-rows', `repeat(${GG_ALL_GAME_CONFIG.boardHeight}, 1fr)`);
}

function initializeBoard() {
	gameBoard = [];
	gameboardElement.innerHTML = '';
	for (let y = 0; y < GG_ALL_GAME_CONFIG.boardHeight; y++) {
		gameBoard[y] = [];
		for (let x = 0; x < GG_ALL_GAME_CONFIG.boardWidth; x++) {
			gameBoard[y][x] = 0;
			const cell = document.createElement('div');
			cell.classList.add('grid-cell');
			cell.dataset.x = x;
			cell.dataset.y = y;
			gameboardElement.appendChild(cell);
		}
	}
}

function createTetromino() {
	const shapeIndex = Math.floor(Math.random() * GG_ALL_GAME_CONFIG.tetrominoShapes.length);
	const tetrominoData = GG_ALL_GAME_CONFIG.tetrominoShapes[shapeIndex];
	return {
		shape: JSON.parse(JSON.stringify(tetrominoData.shape)),
		x: Math.floor(GG_ALL_GAME_CONFIG.boardWidth / 2) - Math.floor(tetrominoData.shape[0].length / 2),
		y: 0,
		color: tetrominoData.color,
		colorIndex: shapeIndex
	};
}

function drawTetromino() {
	if (!currentTetromino) return;
	currentTetromino.shape.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value) {
				const cellX = currentTetromino.x + x;
				const cellY = currentTetromino.y + y;
				const cell = gameboardElement.querySelector(`[data-x="${cellX}"][data-y="${cellY}"]`);
				if (cell) {
					cell.classList.add('tetromino', `tetromino-${currentTetromino.colorIndex}`);
				}
			}
		});
	});
}

function moveTetromino(dx, dy) {
	if (!currentTetromino) return;
	currentTetromino.x += dx;
	currentTetromino.y += dy;
	if (collision()) {
		currentTetromino.x -= dx;
		currentTetromino.y -= dy;
		if (dy > 0) {
			mergeTetromino();
			currentTetromino = createTetromino();
			if (collision()) {
				gameOver();
			}
		}
	}
	updateGame();
}

function rotateTetromino() {
	if (!currentTetromino) return;
	const rotated = currentTetromino.shape[0].map((_, index) =>
		currentTetromino.shape.map(row => row[index]).reverse()
	);
	const previousShape = currentTetromino.shape;
	currentTetromino.shape = rotated;
	if (collision()) {
		currentTetromino.shape = previousShape;
	}
	updateGame();
}

function collision() {
	if (!currentTetromino) return false;
	return currentTetromino.shape.some((row, dy) =>
		row.some((value, dx) => {
			if (!value) return false;
			const newY = currentTetromino.y + dy;
			const newX = currentTetromino.x + dx;
			return (
				newY >= GG_ALL_GAME_CONFIG.boardHeight ||
				newX < 0 ||
				newX >= GG_ALL_GAME_CONFIG.boardWidth ||
				(newY >= 0 && gameBoard[newY][newX])
			);
		})
	);
}

function mergeTetromino() {
	if (!currentTetromino) return;
	currentTetromino.shape.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value) {
				const newY = currentTetromino.y + y;
				const newX = currentTetromino.x + x;
				if (newY >= 0 && newY < GG_ALL_GAME_CONFIG.boardHeight && newX >= 0 && newX < GG_ALL_GAME_CONFIG.boardWidth) {
					gameBoard[newY][newX] = currentTetromino.colorIndex + 1;
				}
			}
		});
	});
	checkLines();
}

function checkLines() {
	let linesCleared = 0;
	for (let y = GG_ALL_GAME_CONFIG.boardHeight - 1; y >= 0; y--) {
		if (gameBoard[y].every(cell => cell !== 0)) {
			linesCleared++;
			gameBoard.splice(y, 1);
			gameBoard.unshift(new Array(GG_ALL_GAME_CONFIG.boardWidth).fill(0));
			y++;
		}
	}
	if (linesCleared > 0) {
		score += linesCleared * GG_ALL_GAME_CONFIG.scorePerLine;
		scoreElement.textContent = `Score: ${score}`;
		increaseSpeed();
	}
}

function increaseSpeed() {
	clearInterval(gameInterval);
	const speed = Math.max(100, GG_ALL_GAME_CONFIG.initialSpeed - Math.floor(score / 1000) * GG_ALL_GAME_CONFIG.speedIncrease);
	gameInterval = setInterval(gameLoop, speed);
}

function updateGame() {
	gameBoard.forEach((row, y) => {
		row.forEach((cell, x) => {
			const cellElement = gameboardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
			cellElement.className = 'grid-cell';
			if (cell !== 0) {
				cellElement.classList.add('tetromino', `tetromino-${cell - 1}`);
			}
		});
	});
	if (currentTetromino) {
		drawTetromino();
	}
}

function isMobileDevice() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function gameLoop() {
	if (!gamePaused && gameStarted) {
		moveTetromino(0, 1);
	}
}

function gameOver() {
	clearInterval(gameInterval);
	alert(`Game Over! Your score: ${score}`);
	gameStarted = false;
	startButton.style.display = 'inline-block';
	pauseButton.style.display = 'none';
	resetButton.style.display = 'none';
}

function startGame() {
	if (!gameStarted) {
		updateBoardDimensions();
		initializeBoard();
		score = 0;
		scoreElement.textContent = 'Score: 0';
		currentTetromino = createTetromino();
		gameInterval = setInterval(gameLoop, GG_ALL_GAME_CONFIG.initialSpeed);
		gameStarted = true;
		gamePaused = false;
		startButton.style.display = 'none';
		pauseButton.style.display = 'inline-block';
		resetButton.style.display = 'none';
		pauseButton.textContent = 'Pause Game';
		updateGame();
	}
}

function pauseGame() {
	if (!gameStarted) return;
	if (gamePaused) {
		gameInterval = setInterval(gameLoop, GG_ALL_GAME_CONFIG.initialSpeed);
		gamePaused = false;
		pauseButton.textContent = 'Pause Game';
		resetButton.style.display = 'none';
	} else {
		clearInterval(gameInterval);
		gamePaused = true;
		pauseButton.textContent = 'Resume Game';
		resetButton.style.display = 'inline-block';
	}
}

function resetGame() {
	if (confirm('Are you sure you want to reset the game? Your current progress will be lost.')) {
		clearInterval(gameInterval);
		gameStarted = false;
		gamePaused = false;
		startButton.style.display = 'inline-block';
		pauseButton.style.display = 'none';
		resetButton.style.display = 'none';
		pauseButton.textContent = 'Pause Game';
		initializeBoard();
		score = 0;
		scoreElement.textContent = 'Score: 0';
		currentTetromino = null;
		updateGame();
	}
}

// Event Listeners
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resetButton.addEventListener('click', resetGame);

document.addEventListener('keydown', (e) => {
	if (!gameStarted || gamePaused) return;
	switch (e.key) {
		case 'ArrowLeft':
			moveTetromino(-1, 0);
			break;
		case 'ArrowRight':
			moveTetromino(1, 0);
			break;
		case 'ArrowDown':
			moveTetromino(0, 1);
			break;
		case 'ArrowUp':
			rotateTetromino();
			break;
	}
});

if (isMobileDevice()) {
	document.documentElement.style.setProperty('--font-family', 'Arial, monospace');
	
	let touchStartX = 0;
	let touchStartY = 0;
	let currentTouchX = 0;
	let currentTouchY = 0;
	let swipeInterval = null;

	gameboardElement.addEventListener('touchstart', function(e) {
		touchStartX = e.changedTouches[0].screenX;
		touchStartY = e.changedTouches[0].screenY;
		currentTouchX = touchStartX;
		currentTouchY = touchStartY;
		if (swipeInterval) clearInterval(swipeInterval);
		swipeInterval = setInterval(handleSwipe, 175);
	}, false);

	gameboardElement.addEventListener('touchmove', function(e) {
		currentTouchX = e.changedTouches[0].screenX;
		currentTouchY = e.changedTouches[0].screenY;
	}, false);

	gameboardElement.addEventListener('touchend', function(e) {
		if (swipeInterval) clearInterval(swipeInterval);
		handleSwipe();
		if ((touchStartX === currentTouchX) && (touchStartY === currentTouchY)) {
			rotateTetromino();
		}
	}, false);

	function handleSwipe() {
		if (!gameStarted || gamePaused) return;
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
	document.body.addEventListener("touchstart", function(e) {
		if (e.target.id === 'game-board') {
			e.preventDefault();
		}
	}, { passive: false });

	document.body.addEventListener("touchend", function(e) {
		if (e.target.id === 'game-board') {
			e.preventDefault();
		}
	}, { passive: false });

	document.body.addEventListener("touchmove", function(e) {
		if (e.target.id === 'game-board') {
			e.preventDefault();
		}
	}, { passive: false });
}

// Initialize game
window.addEventListener('resize', () => {
	updateBoardDimensions();
	if (gameStarted) {
		updateGame();
	}
});

updateBoardDimensions();
initializeBoard();
