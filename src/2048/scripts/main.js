const GG_ALL_GAME_CONFIG = {
	webhookUrl: 'https://webhooks.gameroman.workers.dev/send/2048/score',
	notificationUrl: 'https://webhooks.gameroman.workers.dev/send/2048/play',
	gridSize: 4, // Size of the game grid
	initialTiles: 2, // Number of tiles to start with
	swipeThreshold: 50, // Minimum distance for a swipe to be registered
};

let gameState = {
	userHandle: null,
	grid: [],
	score: 0,
	bestScores: [], // Leaderboard
	touchStartX: 0,
	touchStartY: 0,
};

function initGame() {
	gameState.grid = Array(GG_ALL_GAME_CONFIG.gridSize).fill().map(() => Array(GG_ALL_GAME_CONFIG.gridSize).fill(0));
	gameState.score = 0;
	updateScore();
	for (let i = 0; i < GG_ALL_GAME_CONFIG.initialTiles; i++) {
		addRandomTile();
	}
	renderGrid();
}

function addRandomTile() {
	let emptyCells = [];
	for (let i = 0; i < GG_ALL_GAME_CONFIG.gridSize; i++) {
		for (let j = 0; j < GG_ALL_GAME_CONFIG.gridSize; j++) {
			if (gameState.grid[i][j] === 0) {
				emptyCells.push({
					i,
					j
				});
			}
		}
	}
	if (emptyCells.length > 0) {
		let {
			i,
			j
		} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
		gameState.grid[i][j] = Math.random() < 0.9 ? 2 : 4;
	}
}

function renderGrid() {
	const gridElement = document.getElementById('grid');
	gridElement.style.gridTemplateColumns = `repeat(${GG_ALL_GAME_CONFIG.gridSize}, 1fr)`;
	gridElement.innerHTML = '';
	for (let i = 0; i < GG_ALL_GAME_CONFIG.gridSize; i++) {
		for (let j = 0; j < GG_ALL_GAME_CONFIG.gridSize; j++) {
			const cell = document.createElement('div');
			cell.className = 'cell';
			if (gameState.grid[i][j] !== 0) {
				cell.textContent = gameState.grid[i][j];
				cell.classList.add(`color-${gameState.grid[i][j]}`);
			}
			gridElement.appendChild(cell);
		}
	}
}

function updateScore() {
	document.getElementById('score-value').textContent = gameState.score;
}

function requestUserHandle() {
	window.parent.postMessage({
		type: 'REQUEST_USER_HANDLE_EVENT'
	}, '*');
}

function submitScore() {
	const submitScoreEvent = {
		type: 'REQUEST_SAVE_SCORE_EVENT',
		score_numeric: gameState.score,
		score_text: JSON.stringify({
			userHandle: gameState.userHandle,
			timestamp: Date.now(),
			score: gameState.score,
			boardState: JSON.stringify(gameState.grid),
		})
	};
	window.parent.postMessage(submitScoreEvent, '*');
}

function loadScore() {
	setTimeout(() => {
		const loadScoresEvent = {
			type: 'REQUEST_LOAD_SCORES_EVENT'
		};
		window.parent.postMessage(loadScoresEvent, '*');
	}, 1000);
}

function move(direction) {
	let moved = false;
	let newGrid = JSON.parse(JSON.stringify(gameState.grid));

	function pushNumbers(arr) {
		let newArr = arr.filter(x => x !== 0);
		for (let i = 0; i < newArr.length - 1; i++) {
			if (newArr[i] === newArr[i + 1]) {
				newArr[i] *= 2;
				gameState.score += newArr[i];
				newArr.splice(i + 1, 1);
			}
		}
		while (newArr.length < GG_ALL_GAME_CONFIG.gridSize) {
			newArr.push(0);
		}
		return newArr;
	}
	
	switch (direction) {
		case 'up':
			for (let j = 0; j < GG_ALL_GAME_CONFIG.gridSize; j++) {
				let column = newGrid.map(row => row[j]);
				let newColumn = pushNumbers(column);
				for (let i = 0; i < GG_ALL_GAME_CONFIG.gridSize; i++) {
					if (newGrid[i][j] !== newColumn[i]) {
						moved = true;
						newGrid[i][j] = newColumn[i];
					}
				}
			}
			break;
		case 'down':
			for (let j = 0; j < GG_ALL_GAME_CONFIG.gridSize; j++) {
				let column = newGrid.map(row => row[j]);
				column.reverse();
				let newColumn = pushNumbers(column);
				newColumn.reverse();
				for (let i = 0; i < GG_ALL_GAME_CONFIG.gridSize; i++) {
					if (newGrid[i][j] !== newColumn[i]) {
						moved = true;
						newGrid[i][j] = newColumn[i];
					}
				}
			}
			break;
		case 'left':
			for (let i = 0; i < GG_ALL_GAME_CONFIG.gridSize; i++) {
				let row = newGrid[i];
				let newRow = pushNumbers(row);
				for (let j = 0; j < GG_ALL_GAME_CONFIG.gridSize; j++) {
					if (newGrid[i][j] !== newRow[j]) {
						moved = true;
						newGrid[i][j] = newRow[j];
					}
				}
			}
			break;
		case 'right':
			for (let i = 0; i < GG_ALL_GAME_CONFIG.gridSize; i++) {
				let row = newGrid[i].slice();
				row.reverse();
				let newRow = pushNumbers(row);
				newRow.reverse();
				for (let j = 0; j < GG_ALL_GAME_CONFIG.gridSize; j++) {
					if (newGrid[i][j] !== newRow[j]) {
						moved = true;
						newGrid[i][j] = newRow[j];
					}
				}
			}
			break;
	}
	if (moved) {
		gameState.grid = newGrid;
		addRandomTile();
		renderGrid();
		updateScore();
		if (checkGameOver()) {
			showGameOver();
		}
	}
}

function checkGameOver() {
	for (let i = 0; i < GG_ALL_GAME_CONFIG.gridSize; i++) {
		for (let j = 0; j < GG_ALL_GAME_CONFIG.gridSize; j++) {
			if (gameState.grid[i][j] === 0) return false;
			if (i < GG_ALL_GAME_CONFIG.gridSize - 1 && gameState.grid[i][j] === gameState.grid[i + 1][j]) return false;
			if (j < GG_ALL_GAME_CONFIG.gridSize - 1 && gameState.grid[i][j] === gameState.grid[i][j + 1]) return false;
		}
	}
	return true;
}

function showGameOver() {
	document.getElementById('game-over').classList.remove('hidden');
	sendDiscordMessage('score');
	submitScore();
	loadScore();
}

function showMainMenu() {
	document.getElementById('menu-section').classList.remove('hidden');
	document.getElementById('game-section').classList.add('hidden');
	document.getElementById('leaderboard-section').classList.add('hidden');
	if (checkGameOver()) {
		document.getElementById('start-game').classList.remove('hidden');
		document.getElementById('resume-game').classList.add('hidden');
	} else {
		document.getElementById('start-game').classList.add('hidden');
		document.getElementById('resume-game').classList.remove('hidden');
	}
}

function resumeGame() {
	document.getElementById('menu-section').classList.add('hidden');
	document.getElementById('game-section').classList.remove('hidden');
	document.getElementById('leaderboard-section').classList.add('hidden');
}

function newGame() {
	document.getElementById('game-over').classList.add('hidden');
	resumeGame();
	initGame();
}

function showLeaderboard() {
	const leaderboardBody = document.getElementById('leaderboard-table-body');
	leaderboardBody.innerHTML = '';
	const validScores = gameState.bestScores.filter(score => {
		return (
			(
				(!score.score_text) ||
				score.score_text.includes(score.score_numeric)
			) &&
			score.score_numeric <= 10_000_000_000
		);
	});
	validScores.sort((a, b) => b.score_numeric - a.score_numeric);
	validScores.forEach((score, index) => {
		const row = document.createElement('tr');
		row.innerHTML = `
<td>${index + 1}</td>
<td>${score.handle}</td>
<td>${score.score_numeric.toLocaleString()}</td>
`;
		leaderboardBody.appendChild(row);
	});
	document.getElementById('menu-section').classList.add('hidden');
	document.getElementById('game-section').classList.add('hidden');
	document.getElementById('leaderboard-section').classList.remove('hidden');
}

function getUsernameUrl(userHandle) {
	if (!userHandle || userHandle.startsWith('anon_')) return '\`An anonymous user\`';
	return `[\`@${userHandle}\`](<https://www.wildwest.gg/u/${userHandle}>)`
}

function getWebhookUrl(id) {
	return ((id === 'play') ? GG_ALL_GAME_CONFIG.notificationUrl : GG_ALL_GAME_CONFIG.webhookUrl);
}

function getMessage(id) {
	const usernameUrl = getUsernameUrl(gameState.userHandle);
	switch (id) {
		case 'play':
			return `${usernameUrl} started playing [\`2048\`](<https://www.wildwest.gg/g/mJ9aXNtbv3hA>)`;
		case 'score':
			return `${usernameUrl} scored \`${gameState.score}\``;
		default:
			return 'Unknown';
	}
}

function getDiscordMessage(id) {
	const webhookUrl = getWebhookUrl(id);
	const message = getMessage(id);
	const body = JSON.stringify({
		content: message,
	});
	return [
		webhookUrl,
		body
	];
}

async function sendDiscordMessage(id) {
	const [webhookUrl, body] = getDiscordMessage(id);
	const response = await fetch(
		webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: body
		}
	);
	return response;
}

function handleTouchStart(e) {
	gameState.touchStartX = e.touches[0].clientX;
	gameState.touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
	if (!gameState.touchStartX || !gameState.touchStartY) {
		return;
	}
	let touchEndX = e.changedTouches[0].clientX;
	let touchEndY = e.changedTouches[0].clientY;
	let dx = touchEndX - gameState.touchStartX;
	let dy = touchEndY - gameState.touchStartY;
	// Determine the direction of the swipe
	if (Math.abs(dx) > Math.abs(dy)) {
		if (Math.abs(dx) > GG_ALL_GAME_CONFIG.swipeThreshold) {
			if (dx > 0) {
				move('right');
			} else {
				move('left');
			}
		}
	} else {
		if (Math.abs(dy) > GG_ALL_GAME_CONFIG.swipeThreshold) {
			if (dy > 0) {
				move('down');
			} else {
				move('up');
			}
		}
	}
	// Reset touch start coordinates
	gameState.touchStartX = null;
	gameState.touchStartY = null;
}

document.getElementById('start-game').addEventListener('click', newGame)
document.getElementById('new-game').addEventListener('click', newGame)
document.getElementById('resume-game').addEventListener('click', resumeGame);
document.getElementById('main-menu').addEventListener('click', showMainMenu);
document.getElementById('main-menu-button').addEventListener('click', showMainMenu);
document.getElementById('leaderboard-button').addEventListener('click', showLeaderboard);

// Mobile control buttons
document.getElementById('left-button').addEventListener('click', () => move('left'));
document.getElementById('up-button').addEventListener('click', () => move('up'));
document.getElementById('down-button').addEventListener('click', () => move('down'));
document.getElementById('right-button').addEventListener('click', () => move('right'));

document.addEventListener('keydown', (e) => {
	if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
		e.preventDefault();
		move(e.key.toLowerCase().replace('arrow', ''));
	}
});

if ('ontouchstart' in window) {
	document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchend', handleTouchEnd, false);
}

window.addEventListener('message', (e) => {
	const {
		type,
		scores,
		handle
	} = e.data;
	switch (type) {
		case 'RESPONSE_LOAD_SCORES_EVENT':
			gameState.bestScores = scores;
			break;
		case 'RESPONSE_USER_HANDLE_EVENT':
			if (!handle) return;
			if (gameState.userHandle) return;
			gameState.userHandle = handle;
			sendDiscordMessage('play');
			break;
	}
});

requestUserHandle();
loadScore();
newGame();
