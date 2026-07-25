import { createSignal, For } from "solid-js";

function App() {
  type Color = "red" | "green" | "blue" | "yellow";

  const CONFIG = {
    colors: ["red", "green", "blue", "yellow"] as const,
    startDelay: 1000,
    sequenceDelay: 500,
    flashDuration: 300,
    startRoundLength: 1,
    maxRoundLength: 20,
  } as const;

  const [gameState, setGameState] = createSignal({
    gameSequence: [] as Color[],
    playerSequence: [] as Color[],
    round: 0,
    canPlay: false,
  });

  const [message, setMessage] = createSignal("Press Start to begin!");
  const [startButtonDisabled, setStartButtonDisabled] = createSignal(false);

  const buttonRefs = new Map<Color, HTMLButtonElement>();

  const startGame = () => {
    setGameState({
      gameSequence: [],
      playerSequence: [],
      round: 0,
      canPlay: false,
    });
    setStartButtonDisabled(true);
    nextRound();
  };

  const nextRound = () => {
    setGameState((prev) => ({
      ...prev,
      round: prev.round + 1,
      playerSequence: [],
    }));
    updateRoundDisplay();
    addToSequence();
    playSequence();
  };

  const addToSequence = () => {
    const randomColor =
      CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)]!;
    setGameState((prev) => ({
      ...prev,
      gameSequence: [...prev.gameSequence, randomColor],
    }));
  };

  const playSequence = () => {
    setGameState((prev) => ({ ...prev, canPlay: false }));
    let i = 0;
    const interval = setInterval(() => {
      const color = gameState().gameSequence[i]!;
      const button = buttonRefs.get(color)!;
      playColor(button, color);
      i++;
      if (i >= gameState().gameSequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setGameState((prev) => ({ ...prev, canPlay: true }));
          setMessage("Your turn!");
        }, CONFIG.sequenceDelay);
      }
    }, CONFIG.sequenceDelay + CONFIG.flashDuration);
  };

  const playColor = (button: HTMLButtonElement, color: Color) => {
    button.classList.add("active");
    button.style.opacity = "1";
    setTimeout(() => {
      button.classList.remove("active");
      button.style.opacity = "0.7";
    }, CONFIG.flashDuration);
    playSound(color);
  };

  const playSound = (color: Color) => {
    const audioContext = new (
      window.AudioContext ||
      // @ts-expect-error
      window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    switch (color) {
      case "red":
        oscillator.frequency.setValueAtTime(261.6, audioContext.currentTime); // C4
        break;
      case "green":
        oscillator.frequency.setValueAtTime(329.6, audioContext.currentTime); // E4
        break;
      case "blue":
        oscillator.frequency.setValueAtTime(392.0, audioContext.currentTime); // G4
        break;
      case "yellow":
        oscillator.frequency.setValueAtTime(523.3, audioContext.currentTime); // C5
        break;
    }
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.5,
    );
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const checkPlayerInput = () => {
    const currentIndex = gameState().playerSequence.length - 1;
    if (
      gameState().playerSequence[currentIndex] !==
      gameState().gameSequence[currentIndex]
    ) {
      endGame();
      return;
    }
    if (gameState().playerSequence.length === gameState().gameSequence.length) {
      setGameState((prev) => ({ ...prev, canPlay: false }));
      setTimeout(nextRound, CONFIG.startDelay);
    }
  };

  const handleButtonClick = (button: HTMLButtonElement, color: Color) => {
    if (gameState().canPlay) {
      playColor(button, color);
      setGameState((prev) => ({
        ...prev,
        playerSequence: [...prev.playerSequence, color],
      }));
      checkPlayerInput();
    }
  };

  const endGame = () => {
    setMessage(`Game Over! You reached round ${gameState().round}`);
    setStartButtonDisabled(false);
    setGameState((prev) => ({ ...prev, canPlay: false }));
  };

  const updateRoundDisplay = () => {
    setMessage(`Round ${gameState().round}`);
  };

  return (
    <div id="game-container">
      <h1 class="mt-6 mb-5 text-4xl">Simon Says</h1>

      <div id="message" class="mb-5 font-light text-2xl tracking-[1px]">
        {message()}
      </div>

      <div class="mx-auto mb-8 grid w-70 grid-cols-2 gap-4">
        <For each={CONFIG.colors}>
          {(color) => (
            <button
              type="button"
              id={color}
              class="simon-button cursor-pointer touch-manipulation border-none px-7.5 py-3 text-xl"
              ref={(el) => buttonRefs.set(color, el)}
              onClick={(e) => handleButtonClick(e.currentTarget, color)}
            />
          )}
        </For>
      </div>

      <button
        type="button"
        id="start-button"
        class="tracking-[1px]"
        onClick={startGame}
        disabled={startButtonDisabled()}
      >
        Start Game
      </button>
    </div>
  );
}

export default App;
