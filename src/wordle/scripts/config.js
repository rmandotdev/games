const GG_ALL_GAME_CONFIG = {
	maxGuesses: 6, // Maximum number of guesses allowed
	wordLength: 5, // Length of the word to guess
	guessesListUrl: 'https://roman.is-a.dev/games/wordle/data/guesses.txt',
	answersListUrl: 'https://roman.is-a.dev/games/wordle/data/answers.txt',
	keyboardLayouts: {
		'QWERTY': [
			'QWERTYUIOP',
			'ASDFGHJKL',
			'ZXCVBNM'
		],
		'AZERTY': [
			'AZERTYUIOP',
			'QSDFGHJKLM',
			'WXCVBN'
		]
	}
};
