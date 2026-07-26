import { createSignal, Show } from "solid-js";
import HeapsDisplay from "./HeapsDisplay";
import Section from "./Section";
import Button from "./ui/Button";

type CurrentScreen = "menu" | "game-over" | "game" | "first-choice" | "rules";

function App() {
  const CONFIG = {
    HEAP_COUNT: 3,
    MIN_STONES: 8,
    MAX_STONES: 40,
  } as const;

  const [heaps, setHeaps] = createSignal<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = createSignal(0);
  const [gameMode, setGameMode] = createSignal<"1v1" | "bot" | null>(null);
  const [selectedHeap, setSelectedHeap] = createSignal<number | null>(null);
  const [isGameOver, setIsGameOver] = createSignal(false);
  const [currentScreen, setCurrentScreen] = createSignal<CurrentScreen>("menu");
  const [takeAmount, setTakeAmount] = createSignal(1);

  function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function initializeHeaps() {
    setHeaps(
      Array(CONFIG.HEAP_COUNT)
        .fill(0)
        .map(() => random(CONFIG.MIN_STONES, CONFIG.MAX_STONES)),
    );
  }

  function xor(heaps: number[]) {
    return heaps.reduce((a, b) => a ^ b, 0);
  }

  function botMove() {
    if (xor(heaps()) === 0) {
      const heapIndex = heaps().findIndex((h) => h > 0);
      if (heapIndex !== -1) {
        setHeaps((prev) => {
          const newHeaps = [...prev];
          newHeaps[heapIndex]!--;
          return newHeaps;
        });
      }
      return;
    }

    for (let i = 0; i < heaps().length; i++) {
      for (let take = 1; take <= heaps()[i]!; take++) {
        const tempHeaps = [...heaps()];
        tempHeaps[i]! -= take;
        if (xor(tempHeaps) === 0) {
          setHeaps((prev) => {
            const newHeaps = [...prev];
            newHeaps[i]! -= take;
            return newHeaps;
          });
          return;
        }
      }
    }
  }

  function confirmTake() {
    if (selectedHeap() !== null) {
      setHeaps((prev) => {
        const newHeaps = [...prev];
        newHeaps[selectedHeap()!]! -= takeAmount();
        return newHeaps;
      });
      setSelectedHeap(null);
      checkGameOver();
      if (!isGameOver()) {
        switchPlayer();
      }
    }
  }

  function switchPlayer() {
    setCurrentPlayer((prev) => (prev === 0 ? 1 : 0));
    if (gameMode() === "bot" && currentPlayer() === 1) {
      botMove();
      checkGameOver();
      if (!isGameOver()) {
        setCurrentPlayer(0);
      }
    }
  }

  function checkGameOver() {
    if (!heaps().some((h) => h > 0)) {
      setIsGameOver(true);
      setCurrentScreen("game-over");
    }
  }

  function startTwoPlayer() {
    setGameMode("1v1");
    initializeHeaps();
    setCurrentPlayer(0);
    setCurrentScreen("game");
  }

  function startBot() {
    setGameMode("bot");
    initializeHeaps();
    setCurrentScreen("first-choice");
  }

  function setFirstPlayer(goFirst: boolean) {
    setCurrentPlayer(goFirst ? 0 : 1);
    setCurrentScreen("game");
    if (!goFirst) {
      botMove();
      setCurrentPlayer(0);
    }
  }

  function restartGame() {
    setHeaps([]);
    setCurrentPlayer(0);
    setGameMode(null);
    setSelectedHeap(null);
    setIsGameOver(false);
    setCurrentScreen("menu");
  }

  return (
    <>
      <Show when={currentScreen() === "menu"}>
        <Section>
          <h1 class="mt-7 mb-10 font-bold text-5xl text-glow text-white">
            NIM Game
          </h1>

          <Button onClick={startTwoPlayer} label="Player vs Player" />
          <Button onClick={startBot} label="Player vs Bot" />
          <Button
            onClick={() => setCurrentScreen("rules")}
            label="How to Play"
          />
        </Section>
      </Show>

      <Show when={currentScreen() === "rules"}>
        <Section>
          <h2 class="mb-4 text-white">How to Play</h2>
          <ul class="pl-6 text-left text-white/90 leading-relaxed">
            <li>The game starts with 3 heaps of stones</li>
            <li>Players take turns removing stones from the heaps</li>
            <li>
              On your turn, you can take any number of stones from one heap
            </li>
            <li>You cannot take stones from multiple heaps in one turn</li>
            <li>The player who takes the last stone wins!</li>
          </ul>
          <Button onClick={() => setCurrentScreen("menu")} label="Back" />
        </Section>
      </Show>

      <Show when={currentScreen() === "first-choice"}>
        <Section>
          <h2 class="mb-4 text-white">
            Would you like to make the first move?
          </h2>

          <HeapsDisplay heaps={heaps()} />

          <Button onClick={() => setFirstPlayer(true)} label="Go First" />
          <Button onClick={() => setFirstPlayer(false)} label="Go Second" />
        </Section>
      </Show>

      <Show when={currentScreen() === "game"}>
        <Section>
          <h2 class="mb-4 text-white">
            {gameMode() === "bot"
              ? `${currentPlayer() === 0 ? "Your" : "Bot's"} turn`
              : `Player ${currentPlayer() + 1}'s turn`}
          </h2>

          <HeapsDisplay
            heaps={heaps()}
            selectedHeap={selectedHeap()}
            selectHeap={(index) => {
              setSelectedHeap(index);
              setTakeAmount(1);
            }}
            interactive
          />

          <Show when={selectedHeap() !== null}>
            <div class="mt-8 rounded-10 bg-black/5 p-4">
              <input
                type="range"
                class="custom-slider-thumb m-6 h-2 w-62.5 cursor-pointer rounded-sm bg-white/10"
                min="1"
                max={heaps()[selectedHeap()!]}
                value={takeAmount()}
                onInput={(e) =>
                  setTakeAmount(parseInt(e.currentTarget.value, 10))
                }
              />
              <div class="mx-0 my-2 text-lg text-primary">
                {takeAmount()} {takeAmount() === 1 ? "stone" : "stones"}{" "}
                selected
              </div>
              <Button onClick={confirmTake} label="Take Stones" />
            </div>
          </Show>
        </Section>
      </Show>

      <Show when={currentScreen() === "game-over"}>
        <Section>
          <h2 class="mb-4 text-3xl text-glow text-primary">
            {gameMode() === "bot"
              ? currentPlayer() === 0
                ? "You win!"
                : "Bot wins!"
              : `Player ${currentPlayer() + 1} wins!`}
          </h2>
          <Button onClick={restartGame} label="Play Again" />
        </Section>
      </Show>
    </>
  );
}

export default App;
