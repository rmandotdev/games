import { createSignal, For, Show } from "solid-js";

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
  const [currentScreen, setCurrentScreen] = createSignal("menu");
  const [takeAmount, setTakeAmount] = createSignal(1);

  function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function initializeHeaps() {
    setHeaps(
      Array(CONFIG.HEAP_COUNT)
        .fill(0)
        .map(() => random(CONFIG.MIN_STONES, CONFIG.MAX_STONES))
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

  function selectHeap(index: number) {
    setSelectedHeap(index);
    setTakeAmount(1);
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
        <div id="menu" class="screen">
          <h1>NIM Game</h1>
          <button onClick={startTwoPlayer}>Player vs Player</button>
          <button onClick={startBot}>Player vs Bot</button>
          <button onClick={() => setCurrentScreen("rules")}>How to Play</button>
        </div>
      </Show>

      <Show when={currentScreen() === "rules"}>
        <div id="rules" class="screen">
          <h2>How to Play</h2>
          <ul>
            <li>The game starts with 3 heaps of stones</li>
            <li>Players take turns removing stones from the heaps</li>
            <li>
              On your turn, you can take any number of stones from one heap
            </li>
            <li>You cannot take stones from multiple heaps in one turn</li>
            <li>The player who takes the last stone wins!</li>
          </ul>
          <button onClick={() => setCurrentScreen("menu")}>Back</button>
        </div>
      </Show>

      <Show when={currentScreen() === "first-choice"}>
        <div id="first-choice" class="screen">
          <h2>Would you like to make the first move?</h2>
          <div class="heaps-display">
            <For each={heaps()}>
              {(count, index) => (
                <div
                  class={`heap ${count > 0 ? "selectable" : ""}`}
                  data-heap={index()}
                >
                  <div class="heap-label">
                    <span>{count}</span> stones
                  </div>
                  <div class="stones">
                    <For each={Array(count).fill(0)}>
                      {() => <div class="stone"></div>}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
          <button onClick={() => setFirstPlayer(true)}>Go First</button>
          <button onClick={() => setFirstPlayer(false)}>Go Second</button>
        </div>
      </Show>

      <Show when={currentScreen() === "game"}>
        <div id="game" class="screen">
          <h2>
            {gameMode() === "bot"
              ? `${currentPlayer() === 0 ? "Your" : "Bot's"} turn`
              : `Player ${currentPlayer() + 1}'s turn`}
          </h2>
          <div class="heaps-display">
            <For each={heaps()}>
              {(count, index) => (
                <div
                  class={`heap ${count > 0 ? "selectable" : ""} ${
                    selectedHeap() === index() ? "selected" : ""
                  }`}
                  data-heap={index()}
                  onClick={() => count > 0 && selectHeap(index())}
                >
                  <div class="heap-label">
                    <span>{count}</span> stones
                  </div>
                  <div class="stones">
                    <For each={Array(count).fill(0)}>
                      {() => <div class="stone"></div>}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
          <Show when={selectedHeap() !== null}>
            <div id="take-controls">
              <input
                type="range"
                id="take-amount"
                class="range-selector"
                min="1"
                max={heaps()[selectedHeap()!]}
                value={takeAmount()}
                onInput={(e) => setTakeAmount(parseInt(e.currentTarget.value))}
              />
              <div id="stones-selected">
                {takeAmount()} {takeAmount() === 1 ? "stone" : "stones"}{" "}
                selected
              </div>
              <button onClick={confirmTake}>Take Stones</button>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={currentScreen() === "game-over"}>
        <div id="game-over" class="screen">
          <h2>
            {gameMode() === "bot"
              ? currentPlayer() === 0
                ? "You win!"
                : "Bot wins!"
              : `Player ${currentPlayer() + 1} wins!`}
          </h2>
          <button onClick={restartGame}>Play Again</button>
        </div>
      </Show>
    </>
  );
}

export default App;
