import { createSignal, onMount, Show } from "solid-js";
import History, { type HistoryItem } from "./History";
import Button from "./ui/Button";

function App() {
  const CONFIG = {
    numberLength: 4,
    digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  } as const;

  const [gameState, setGameState] = createSignal({
    guesses: 0,
    secretNumber: "",
    gameOver: false,
  });

  const [history, setHistory] = createSignal<HistoryItem[]>([]);
  const [guess, setGuess] = createSignal("");
  const [error, setError] = createSignal("");
  const [result, setResult] = createSignal("");

  function shuffleArray(array: (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j]!, array[i]!];
    }
  }

  function generateSecretNumber() {
    const shuffled = [...CONFIG.digits];
    shuffleArray(shuffled);
    return shuffled.slice(0, CONFIG.numberLength).join("");
  }

  function checkGuess(guess: string) {
    let bulls = 0;
    let cows = 0;
    const guessSet = new Set(guess);
    if (
      guess.length !== CONFIG.numberLength ||
      guessSet.size !== CONFIG.numberLength
    ) {
      return {
        error: `Invalid guess. Must be ${CONFIG.numberLength} unique digits.`,
      } as const;
    }
    for (let i = 0; i < CONFIG.numberLength; i++) {
      if (guess[i] === gameState().secretNumber[i]) {
        bulls++;
      } else if (gameState().secretNumber.includes(guess[i]!)) {
        cows++;
      }
    }
    return { bulls, cows } as const;
  }

  function startGame() {
    setGameState({
      guesses: 0,
      secretNumber: generateSecretNumber(),
      gameOver: false,
    });
    setHistory([]);
    setResult("");
    setGuess("");
    setError("");
  }

  function endGame() {
    setGameState((prev) => ({ ...prev, gameOver: true }));
    setResult(
      `Congratulations! You guessed the number ${gameState().secretNumber} in ${
        gameState().guesses
      } guesses!`,
    );
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (gameState().gameOver) return;

    const result = checkGuess(guess());
    if ("error" in result) {
      setError(result.error);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setGameState((prev) => ({ ...prev, guesses: prev.guesses + 1 }));
    setHistory((prev) => [...prev, { guess: guess(), ...result }]);

    if (result.bulls === CONFIG.numberLength) {
      endGame();
    }
    setGuess("");
  }

  function handleInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    setGuess(input.value.slice(0, CONFIG.numberLength));
    setError("");
  }

  onMount(() => {
    startGame();
  });

  return (
    <div class="w-full max-w-container rounded-2xl bg-background p-container text-center shadow-container">
      <h1 class="my-6 text-3xl">Bulls and Cows</h1>

      <div class="rounded text-app-600 text-sm dark:text-app-500">
        <p>Guess the 4-digit number</p>
        <p>Bulls: correct digits in the correct position</p>
        <p>Cows: correct digits in the wrong position</p>
      </div>

      <Show when={history().length > 0}>
        <History history={history()} />
      </Show>

      <Show when={result()}>
        <p class="scrollbar-thin my-1.25 items-center rounded-5 p-2 font-bold text-black dark:text-light">
          {result()}
        </p>
      </Show>

      <Show when={!gameState().gameOver}>
        <form class="flex items-center justify-center" onSubmit={handleSubmit}>
          <input
            type="number"
            class="no-spinner my-2.5 mr-1.25 w-auto flex-1 rounded-5 border-2 border-app-400 border-solid bg-background p-2.5 text-base outline-none transition-colors duration-300 ease-[ease] focus:border-primary dark:border-app-700"
            value={guess()}
            onInput={handleInput}
            min="0"
            max="9999"
            inputmode="numeric"
            pattern="\d{4}"
            required
            placeholder="Enter your 4-digit guess"
            maxlength="4"
            classList={{ invalid: !!error() }}
          />
          <Show when={error()}>
            <span class="text-red-500">{error()}</span>
          </Show>
          <Button type="submit" label="Guess" />
        </form>
      </Show>
    </div>
  );
}

export default App;
