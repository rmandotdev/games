function setTheme(theme) {
	gameState.settings.theme = theme;
	document.body.classList.remove('dark-mode');
	document.getElementById('settings-container').classList.remove('dark-mode');
	if (theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
		document.body.classList.add('dark-mode');
		document.getElementById('settings-container').classList.add('dark-mode');
	}
}

function initializeTheme() {
	const themeSelect = document.getElementById('theme-select');
	themeSelect.value = gameState.settings.theme;
	setTheme(gameState.settings.theme);
}

function setKeyboardLayout(keyboardLayout) {
	gameState.settings.keyboardLayout = keyboardLayout;
	createKeyboard();
}

function initializeKeyboardLayout() {
	const keyboardLayoutSelect = document.getElementById('keyboard-layout-select');
	keyboardLayoutSelect.value = gameState.settings.keyboardLayout;
}

function setSubmitButtonType(submitButtonType) {
	gameState.settings.submitButtonType = submitButtonType;
	createKeyboard();
}

function initializeSubmitButtonType() {
	const submitButtonTypeSelect = document.getElementById('submit-button-type-select');
	submitButtonTypeSelect.value = gameState.settings.submitButtonType;
}

initializeTheme();
initializeKeyboardLayout();
initializeSubmitButtonType();

// Settings event listeners
document.getElementById('theme-select').addEventListener('change', (event) => {
	setTheme(event.target.value);
	saveData();
});

document.getElementById('keyboard-layout-select').addEventListener('change', (event) => {
	setKeyboardLayout(event.target.value);
	saveData();
});

document.getElementById('submit-button-type-select').addEventListener('change', (event) => {
	setSubmitButtonType(event.target.value);
	saveData();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
	if (gameState.settings.theme === 'system') {
		setTheme('system');
	}
});
