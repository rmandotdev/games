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
  const [pulseMessage, setPulseMessage] = createSignal(false);
  const [pulseStartButton, setPulseStartButton] = createSignal(false);

  const buttonRefs = new Map<Color, HTMLButtonElement>();
  CONFIG.colors.forEach((color) => {
    buttonRefs.set(color, null!);
  });

  const startGame = () => {
    setGameState({
      gameSequence: [],
      playerSequence: [],
      round: 0,
      canPlay: false,
    });
    setStartButtonDisabled(true);
    setPulseStartButton(false);
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
      playColor(gameState().gameSequence[i]!);
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

  const playColor = (color: Color) => {
    const button = buttonRefs.get(color);
    if (button) {
      button.classList.add("active");
      button.style.opacity = "1";
      setTimeout(() => {
        button.classList.remove("active");
        button.style.opacity = "0.7";
      }, CONFIG.flashDuration);
    }
    playSound(color);
  };

  const playSound = (color: Color) => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
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
      audioContext.currentTime + 0.5
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

  const handleButtonClick = (color: Color) => {
    if (gameState().canPlay) {
      playColor(color);
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
    setPulseStartButton(true);
  };

  const updateRoundDisplay = () => {
    setMessage(`Round ${gameState().round}`);
    setPulseMessage(true);
    setTimeout(() => {
      setPulseMessage(false);
    }, 1000);
  };

  return (
    <div id="game-container">
      <h1>Simon Says</h1>

      <div id="message" classList={{ pulse: pulseMessage() }}>
        {message()}
      </div>

      <div id="simon-board">
        <For each={CONFIG.colors}>
          {(color) => (
            <button
              id={color}
              class="simon-button"
              ref={(el) => buttonRefs.set(color, el)}
              onClick={() => handleButtonClick(color)}
            />
          )}
        </For>
      </div>

      <button
        id="start-button"
        onClick={startGame}
        disabled={startButtonDisabled()}
        classList={{ pulse: pulseStartButton() }}
      >
        Start Game
      </button>
    </div>
  );
}

export default App;
