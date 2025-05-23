const HEAP_COUNT = 3;
const MIN_STONES = 8;
const MAX_STONES = 40;

let gameState = {
	heaps: [],
	currentPlayer: 0,
	gameMode: null,
	selectedHeap: null,
	isGameOver: false
};

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initializeHeaps() {
	gameState.heaps = Array(HEAP_COUNT).fill(0).map(() => random(MIN_STONES, MAX_STONES));
	updateHeapsDisplay();
}

function updateHeapsDisplay() {
	const displays = document.querySelectorAll('.heaps-display');
	
	displays.forEach(display => {
		display.innerHTML = gameState.heaps.map((count, index) => `
			<div class="heap ${count > 0 ? 'selectable' : ''} ${gameState.selectedHeap === index ? 'selected' : ''}" data-heap="${index}">
				<div class="heap-label"><span>${count}</span> stones</div>
				<div class="stones">
					${Array(count).fill('<div class="stone"></div>').join('')}
				</div>
			</div>
		`).join('');

		// Add click handlers for heaps in game screen
		if (display.closest('#game')) {
			display.querySelectorAll('.heap').forEach(heap => {
				const heapIndex = parseInt(heap.dataset.heap);
				if (gameState.heaps[heapIndex] > 0) {
					heap.addEventListener('click', () => selectHeap(heapIndex));
				}
			});
		}
	});
}

function xor(heaps) {
	return heaps.reduce((a, b) => a ^ b);
}

function botMove() {
	if (xor(gameState.heaps) === 0) {
		// Losing position, take one stone from first non-empty heap
		const heapIndex = gameState.heaps.findIndex(h => h > 0);
		if (heapIndex !== -1) {
			gameState.heaps[heapIndex]--;
		}
		return;
	}

	// Find winning move
	for (let i = 0; i < gameState.heaps.length; i++) {
		for (let take = 1; take <= gameState.heaps[i]; take++) {
			const tempHeaps = [...gameState.heaps];
			tempHeaps[i] -= take;
			if (xor(tempHeaps) === 0) {
				gameState.heaps[i] -= take;
				return;
			}
		}
	}
}

function selectHeap(index) {
	gameState.selectedHeap = index;
	const takeControls = document.getElementById('take-controls');
	const takeAmount = document.getElementById('take-amount');
	takeAmount.max = gameState.heaps[index];
	takeAmount.value = 1;
	updateStonesSelectedText(1);
	takeControls.classList.remove('hidden');
	updateHeapsDisplay();
	
	// Add event listener for the range input
	takeAmount.addEventListener('input', function() {
		updateStonesSelectedText(this.value);
	});
}

function updateStonesSelectedText(amount) {
	const stonesSelected = document.getElementById('stones-selected');
	stonesSelected.textContent = `${amount} ${amount === '1' ? 'stone' : 'stones'} selected`;
}

function confirmTake() {
	const amount = parseInt(document.getElementById('take-amount').value);
	gameState.heaps[gameState.selectedHeap] -= amount;
	document.getElementById('take-controls').classList.add('hidden');
	gameState.selectedHeap = null;
	
	updateHeapsDisplay();
	checkGameOver();
	if (!gameState.isGameOver) {
		switchPlayer();
	}
}

function switchPlayer() {
	gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
	updateTurnIndicator();
	
	if (gameState.gameMode === 'bot' && gameState.currentPlayer === 1) {
			botMove();
			updateHeapsDisplay();
			checkGameOver();
			if (!gameState.isGameOver) {
				switchPlayer();
			}
	}
}

function updateTurnIndicator() {
	const indicator = document.getElementById('turn-indicator');
	indicator.textContent = gameState.gameMode === 'bot' ?
		`${gameState.currentPlayer === 0 ? 'Your' : "Bot's"} turn` :
		`Player ${gameState.currentPlayer + 1}'s turn`;
}

function checkGameOver() {
	if (!gameState.heaps.some(h => h > 0)) {
		gameState.isGameOver = true;
		const winner = document.getElementById('winner');
		if (gameState.gameMode === 'bot') {
			winner.textContent = gameState.currentPlayer === 0 ? 'You win!' : 'Bot wins!';
		} else {
			winner.textContent = `Player ${gameState.currentPlayer + 1} wins!`;
		}
		showScreen('game-over');
	}
}

function showScreen(screenId) {
	document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
	document.getElementById(screenId).classList.remove('hidden');
}

function startTwoPlayer() {
	gameState.gameMode = '1v1';
	initializeHeaps();
	gameState.currentPlayer = 0;
	updateTurnIndicator();
	showScreen('game');
};

function startBot() {
	gameState.gameMode = 'bot';
	initializeHeaps();
	showScreen('first-choice');
};

function setFirstPlayer(goFirst) {
	gameState.currentPlayer = goFirst ? 0 : 1;
	showScreen('game');
	updateTurnIndicator();
	
	if (!goFirst) {
		botMove();
		updateHeapsDisplay();
		switchPlayer();
	}
};

function restartGame() {
	gameState = {
		heaps: [],
		currentPlayer: 0,
		gameMode: null,
		selectedHeap: null,
		isGameOver: false
	};
	showScreen('menu');
};


document.getElementById('player-vs-player').addEventListener('click', startTwoPlayer);
document.getElementById('player-vs-bot').addEventListener('click', startBot);
document.getElementById('rules-button').addEventListener('click', () => showScreen('rules'));

document.getElementById('back-button').addEventListener('click', () => showScreen('menu'));

document.getElementById('go-first').addEventListener('click', () => setFirstPlayer(true));
document.getElementById('go-second').addEventListener('click', () => setFirstPlayer(false));

document.getElementById('take-button').addEventListener('click', confirmTake);
document.getElementById('restart-button').addEventListener('click', restartGame);