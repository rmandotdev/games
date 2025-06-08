const CONFIG = {
	numberLength: 4, 
	digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
};

let gameState = {
	guesses: 0,
	secretNumber: '',
	gameOver: false
};

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function generateSecretNumber() {
	const shuffled = [...CONFIG.digits];
	shuffleArray(shuffled);
	return shuffled.slice(0, CONFIG.numberLength).join('');
}

function checkGuess(guess) {
	let bulls = 0;
	let cows = 0;
	const guessSet = new Set(guess);
	if (guess.length !== 4 || guessSet.size !== 4) {
		return {
			error: "Invalid guess. Must be 4 unique digits."
		};
	}
	for (let i = 0; i < CONFIG.numberLength; i++) {
		if (guess[i] === gameState.secretNumber[i]) {
			bulls++;
		} else if (gameState.secretNumber.includes(guess[i])) {
			cows++;
		}
	}
	return {
		bulls,
		cows
	};
}

function showError(message) {
	const input = document.getElementById('guessInput');
	input.setCustomValidity(message);
	input.reportValidity();
	setTimeout(() => {
		input.setCustomValidity('');
	}, 3000);
}

function updateHistory(guess, result) {
	const historyDiv = document.getElementById('history');
	if (gameState.guesses === 1) {
		historyDiv.classList.remove('hidden');
		const header = document.createElement('div');
		header.className = 'history-header';
		header.innerHTML = `
<div>#</div>
<div>Guess</div>
<div>Bulls</div>
<div>Cows</div>
`;
		historyDiv.appendChild(header);
	}
	const newGuess = document.createElement('div');
	newGuess.className = 'history-entry';
	newGuess.innerHTML = `
<div>${gameState.guesses}</div>
<div>${guess}</div>
<div>${result.bulls}</div>
<div>${result.cows}</div>
`;
	historyDiv.appendChild(newGuess);
	historyDiv.scrollTop = historyDiv.scrollHeight;
}

function startGame() {
	gameState.secretNumber = generateSecretNumber();
	gameState.guesses = 0;
	gameState.gameOver = false;
	document.getElementById('guess-form').classList.remove('hidden');
	document.getElementById('result').textContent = '';
	document.getElementById('history').innerHTML = '';
	document.getElementById('history').classList.add('hidden');
}

function endGame() {
	gameState.gameOver = true;
	let resultDiv = document.getElementById('result');
	resultDiv.textContent = `Congratulations! You guessed the number ${gameState.secretNumber} in ${gameState.guesses} guesses!`;
	document.getElementById('guess-form').classList.add('hidden');
	document.getElementById('result').classList.remove('hidden');
}

document.getElementById('guess-form').addEventListener('submit', function(e) {
	e.preventDefault();
	if (gameState.gameOver) return;
	let guess = document.getElementById('guessInput').value;
	let result = checkGuess(guess);
	if (result.error) {
		showError(result.error);
	} else {
		gameState.guesses++;
		updateHistory(guess, result);
		if (result.bulls === CONFIG.numberLength) {
			endGame();
		}
		document.getElementById('guessInput').value = '';
	}
});

document.getElementById('guessInput').addEventListener('input', function(e) {
	const input = e.target;
	input.value = input.value.slice(0, 4);
	input.setCustomValidity("");
});

startGame();
