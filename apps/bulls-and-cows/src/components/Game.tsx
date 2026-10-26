import { createSignal, onMount, Show } from "solid-js";
import type { HistoryItem } from "./History";
import History from "./History";
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
    <div class="max-w-container bg-background p-container shadow-container w-full rounded-2xl text-center">
      <h1 class="my-6 text-3xl">Bulls and Cows</h1>

      <div class="text-app-600 dark:text-app-500 rounded text-sm">
        <p>Guess the 4-digit number</p>
        <p>Bulls: correct digits in the correct position</p>
        <p>Cows: correct digits in the wrong position</p>
      </div>

      <Show when={history().length > 0}>
        <History history={history()} />
      </Show>

      <Show when={result()}>
        <p class="rounded-5 dark:text-light my-1.25 scrollbar-thin items-center p-2 font-bold text-black">
          {result()}
        </p>
      </Show>

      <Show
        when={!gameState().gameOver}
        fallback={
          <div class="mt-4">
            <Button onClick={startGame} label="Play Again" />
          </div>
        }
      >
        <form
          class="flex flex-col items-center justify-center"
          onSubmit={handleSubmit}
        >
          <div class="flex w-full items-center justify-center">
            <input
              type="number"
              class="no-spinner rounded-5 border-app-400 bg-background focus:border-primary dark:border-app-700 my-2.5 mr-1.25 w-auto flex-1 border-2 border-solid p-2.5 text-base transition-colors duration-300 ease-[ease] outline-none"
              value={guess()}
              onInput={handleInput}
              min="0"
              max="9999"
              inputmode="numeric"
              pattern="\d{4}"
              required
              placeholder="Enter your 4-digit guess"
              maxlength="4"
            />
            <Button type="submit" label="Guess" />
          </div>
          <div class="h-6 w-full text-center">
            <Show when={error()}>
              <span class="text-red-500">{error()}</span>
            </Show>
          </div>
        </form>
      </Show>
    </div>
  );
}

export default App;
