

document.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		handleKeyPress('Enter');
	} else if (event.key === 'Backspace') {
		handleKeyPress('Delete');
	} else if (event.key.match(/^[a-zA-Z]$/)) {
		handleKeyPress(event.key.toUpperCase());
	}
});

function addKeyToKeybaord(KeyLabel, keyName, x = 1, y = 1) {
	const buttonElement = document.createElement('button');
	buttonElement.textContent = KeyLabel;
	buttonElement.classList.add('key');
	buttonElement.addEventListener('click', () => handleKeyPress(keyName));
	if (x === 2) {
		buttonElement.style.gridColumn = `span ${x}`;
		buttonElement.style.width = `calc(var(--key-size) * ${x} + var(--keyboard-gap))`;
	} else if (x > 2) {
		buttonElement.style.gridColumn = `span ${x}`
		buttonElement.style.width = `calc(var(--key-size) * ${x} + var(--keyboard-gap)) * ${x-1}`;
	}
	if (y === 2) {
		buttonElement.style.gridRow = `span ${y}`
		buttonElement.style.height = `calc(var(--key-size) * ${y} + var(--keyboard-gap))`;
	} else if (y > 2) {
		buttonElement.style.gridRow = `span ${y}`
		buttonElement.style.height = `calc(var(--key-size) * ${y} + var(--keyboard-gap)) * ${y-1}`;
	}
	if (keyName === 'Enter') {
		buttonElement.style.fontSize = 'var(--enter-key-font-size)';
	}
	keyboard.appendChild(buttonElement);
}

function createKeyboard() {
	const keyboard = document.getElementById('keyboard');
	keyboard.innerHTML = '';
	const keyboardLayout = GG_ALL_GAME_CONFIG.keyboardLayouts[gameState.settings.keyboardLayout];
	
	for (let key of keyboardLayout[0]) {
		addKeyToKeybaord(key, key);
	}
	for (let key of keyboardLayout[1]) {
		addKeyToKeybaord(key, key);
	}
	if (gameState.settings.keyboardLayout === 'QWERTY') {
		addKeyToKeybaord('↵', 'Enter', 1, 2);
	} else if (gameState.settings.keyboardLayout === 'AZERTY') {
		addKeyToKeybaord('↵', 'Enter', 2, 1);
	}
	for (let key of keyboardLayout[2]) {
		addKeyToKeybaord(key, key);
	}
	addKeyToKeybaord('⌫', 'Delete', 2, 1);
	if (gameState.settings.submitButtonType === 'SUBMIT') {
		addKeyToKeybaord('SUBMIT', 'Submit', 10, 1);
	}
	
	// Apply stored key colors
	for (let key in gameState.keyColors) {
		const keyElement = [...keyboard.children].find(el => el.textContent.toLowerCase() === key.toLowerCase());
		if (keyElement) {
			keyElement.className = 'key ' + gameState.keyColors[key];
		}
	}
}

function handleKeyPress(key) {
	if (gameState.gameOver) return;
	if (key === 'Enter' || key === 'Submit') {
		if (gameState.currentTile === GG_ALL_GAME_CONFIG.wordLength) {
			submitGuess();
		}
	} else if (key === 'Delete') {
		if (gameState.currentTile > 0) {
			gameState.currentTile--;
			const tiles = document.querySelectorAll('.tile');
			const currentTile = tiles[gameState.currentRow * GG_ALL_GAME_CONFIG.wordLength + gameState.currentTile];
			currentTile.textContent = '';
			currentTile.classList.remove('pop');
			gameState.guesses[gameState.currentRow] = gameState.guesses[gameState.currentRow].slice(0, -1);
		}
	} else if (gameState.currentTile < GG_ALL_GAME_CONFIG.wordLength) {
		const tiles = document.querySelectorAll('.tile');
		const currentTile = tiles[gameState.currentRow * GG_ALL_GAME_CONFIG.wordLength + gameState.currentTile];
		currentTile.textContent = key;
		currentTile.classList.add('pop');
		setTimeout(() => currentTile.classList.remove('pop'), 150);
		gameState.guesses[gameState.currentRow] = (gameState.guesses[gameState.currentRow] || '') + key;
		gameState.currentTile++;
	}
}
