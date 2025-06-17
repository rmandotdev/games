/**
 * @typedef {object} GameStateSettings
 * @property {string} theme
 * @property {"QWERTY" | "AZERTY"} keyboardLayout
 * @property {string} submitButtonType
 */

/**
 * @typedef {object} GameStateStats
 * @property {number} gamesPlayed
 * @property {number} gamesWon
 * @property {number} currentStreak
 * @property {number} maxStreak
 * @property {number[]} guessDistribution
 */

/**
 * @typedef {object} GameState
 * @property {"daily" | "unlimited"} gameMode
 * @property {number} currentRow
 * @property {number} currentTile
 * @property {boolean} gameOver
 * @property {string} secretWord
 * @property {string[]} guesses
 * @property {string} currentSection
 * @property {null | number} dailyPlayedLast
 * @property {GameStateSettings} settings
 * @property {GameStateStats} stats
 * @property {any} keyColors
 */
