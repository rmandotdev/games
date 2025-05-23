let GG_ALL_GAME_CONFIG = {
	colors: ['red', 'green', 'blue', 'yellow'], // Available colors
	startDelay: 1000, // Delay before starting sequence in ms
	sequenceDelay: 500, // Delay between each color in sequence in ms
	flashDuration: 300, // Duration of color flash in ms
	startRoundLength: 1, // Initial sequence length
	maxRoundLength: 20 // Maximum sequence length
};

let gameState = {
	gameSequence: [],
	playerSequence: [],
	round: 0,
	canPlay: false
};

const startButton = document.getElementById('start-button');
const messageElement = document.getElementById('message');
const leaderboardList = document.getElementById('leaderboard-list');

startButton.addEventListener('click', startGame);

document.querySelectorAll('.simon-button').forEach(button => {
	button.addEventListener('click', () => {
		if (gameState.canPlay) {
			playColor(button.id);
			gameState.playerSequence.push(button.id);
			checkPlayerInput();
		}
	});
});

function startGame() {
	gameState.gameSequence = [];
	gameState.playerSequence = [];
	gameState.round = 0;
	gameState.canPlay = false;
	startButton.disabled = true;
	nextRound();
	requestLeaderboard();
}

function nextRound() {
	gameState.round++;
	gameState.playerSequence = [];
	updateRoundDisplay();
	addToSequence();
	playSequence();
}

function addToSequence() {
	const randomColor = GG_ALL_GAME_CONFIG.colors[Math.floor(Math.random() * GG_ALL_GAME_CONFIG.colors.length)];
	gameState.gameSequence.push(randomColor);
}

function playSequence() {
	gameState.canPlay = false;
	let i = 0;
	const interval = setInterval(() => {
		playColor(gameState.gameSequence[i]);
		i++;
		if (i >= gameState.gameSequence.length) {
			clearInterval(interval);
			setTimeout(() => {
				gameState.canPlay = true;
				messageElement.textContent = 'Your turn!';
			}, GG_ALL_GAME_CONFIG.sequenceDelay);
		}
	}, GG_ALL_GAME_CONFIG.sequenceDelay + GG_ALL_GAME_CONFIG.flashDuration);
}

function playColor(color) {
	const button = document.getElementById(color);
	button.classList.add('active');
	button.style.opacity = '1';
	setTimeout(() => {
		button.classList.remove('active');
		button.style.opacity = '0.7';
	}, GG_ALL_GAME_CONFIG.flashDuration);
	playSound(color);
}

function playSound(color) {
	const audioContext = new(window.AudioContext || window.webkitAudioContext)();
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();
	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);
	switch (color) {
		case 'red':
			oscillator.frequency.setValueAtTime(261.6, audioContext.currentTime); // C4
			break;
		case 'green':
			oscillator.frequency.setValueAtTime(329.6, audioContext.currentTime); // E4
			break;
		case 'blue':
			oscillator.frequency.setValueAtTime(392.0, audioContext.currentTime); // G4
			break;
		case 'yellow':
			oscillator.frequency.setValueAtTime(523.3, audioContext.currentTime); // C5
			break;
	}
	gainNode.gain.setValueAtTime(0, audioContext.currentTime);
	gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
	oscillator.start(audioContext.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
	oscillator.stop(audioContext.currentTime + 0.5);
}

function checkPlayerInput() {
	const currentIndex = gameState.playerSequence.length - 1;
	if (gameState.playerSequence[currentIndex] !== gameState.gameSequence[currentIndex]) {
		endGame();
		return;
	}
	if (gameState.playerSequence.length === gameState.gameSequence.length) {
		gameState.canPlay = false;
		setTimeout(nextRound, GG_ALL_GAME_CONFIG.startDelay);
	}
}

function endGame() {
	messageElement.textContent = `Game Over! You reached round ${gameState.round}`;
	startButton.disabled = false;
	startButton.classList.add('pulse');
	gameState.canPlay = false;
	saveScore(gameState.round, `Round ${gameState.round}`);
}

function updateRoundDisplay() {
	messageElement.textContent = `Round ${gameState.round}`;
	messageElement.classList.add('pulse');
	setTimeout(() => {
		messageElement.classList.remove('pulse');
	}, 1000);
}

function saveScore(score, scoreText) {
	const submitScoreEvent = {
		type: 'REQUEST_SAVE_SCORE_EVENT',
		score_numeric: score,
		score_text: scoreText,
	};
	window.parent.postMessage(submitScoreEvent, '*');
	requestLeaderboard();
}

function requestLeaderboard() {
	window.parent.postMessage({
		type: 'REQUEST_LOAD_SCORES_EVENT'
	}, '*');
}

window.addEventListener('message', (event) => {
	const {
		type,
		scores
	} = event.data;
	if (type === 'RESPONSE_LOAD_SCORES_EVENT') {
		updateLeaderboard(scores);
	}
});

function updateLeaderboard(scores) {
	leaderboardList.innerHTML = '';
	scores.slice(0, 10).forEach((score, index) => {
		const li = document.createElement('li');
		li.textContent = `${index + 1}. ${score.handle}: ${score.score_text}`;
		leaderboardList.appendChild(li);
	});
}

// Initial leaderboard load
requestLeaderboard();
