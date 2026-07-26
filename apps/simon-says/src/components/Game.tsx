import { createSignal } from "solid-js";
import type { Color } from "#components/SimonButton";
import SimonButton from "#components/SimonButton";

function App() {
  const CONFIG = {
    colors: ["red", "green", "blue", "yellow"] as const,
    startDelay: 1000,
    sequenceDelay: 500,
    flashDuration: 300,
  } as const;

  const [gameState, setGameState] = createSignal({
    gameSequence: [] as Color[],
    playerSequence: [] as Color[],
  });

  const [canPlay, setCanPlay] = createSignal(false);
  const [round, setRound] = createSignal(0);
  const [message, setMessage] = createSignal("Press Start to begin!");
  const [startButtonDisabled, setStartButtonDisabled] = createSignal(false);

  const buttonRefs = new Map<Color, HTMLButtonElement>();

  const startGame = () => {
    setGameState({ gameSequence: [], playerSequence: [] });
    setCanPlay(false);
    setRound(0);
    setStartButtonDisabled(true);
    nextRound();
  };

  const nextRound = () => {
    setGameState((prev) => ({ ...prev, playerSequence: [] }));
    setRound((prev) => prev + 1);
    setMessage(`Round ${round()}`);
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
    setCanPlay(false);
    let i = 0;
    const interval = setInterval(() => {
      const color = gameState().gameSequence[i]!;
      const button = buttonRefs.get(color)!;
      playColor(button, color);
      i++;
      if (i >= gameState().gameSequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCanPlay(true);
          setMessage("Your turn!");
        }, CONFIG.sequenceDelay);
      }
    }, CONFIG.sequenceDelay + CONFIG.flashDuration);
  };

  const playColor = (button: HTMLButtonElement, color: Color) => {
    button.classList.add("flashing");
    button.style.opacity = "1";
    setTimeout(() => {
      button.classList.remove("flashing");
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
      setCanPlay(false);
      setTimeout(nextRound, CONFIG.startDelay);
    }
  };

  const handleButtonClick = (button: HTMLButtonElement, color: Color) => {
    if (canPlay()) {
      playColor(button, color);
      setGameState((prev) => ({
        ...prev,
        playerSequence: [...prev.playerSequence, color],
      }));
      checkPlayerInput();
    }
  };

  const endGame = () => {
    setMessage(`Game Over! You reached round ${round()}`);
    setStartButtonDisabled(false);
    setCanPlay(false);
  };

  return (
    <div class="w-full max-w-125 rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-container backdrop-blur-xs">
      <h1 class="title-shadow mt-6 mb-5 font-bold text-4xl">Simon Says</h1>

      <div class="mb-5 font-light text-2xl tracking-[1px]">{message()}</div>

      <div class="mx-auto mb-8 grid w-70 grid-cols-2 gap-4">
        <SimonButton
          variant="red"
          onRef={(el) => buttonRefs.set("red", el)}
          onClick={handleButtonClick}
        />
        <SimonButton
          variant="green"
          onRef={(el) => buttonRefs.set("green", el)}
          onClick={handleButtonClick}
        />
        <SimonButton
          variant="blue"
          onRef={(el) => buttonRefs.set("blue", el)}
          onClick={handleButtonClick}
        />
        <SimonButton
          variant="yellow"
          onRef={(el) => buttonRefs.set("yellow", el)}
          onClick={handleButtonClick}
        />
      </div>

      <button
        type="button"
        class="cursor-pointer touch-manipulation rounded-3xl border-none bg-button px-7.5 py-3 font-bold text-black text-xl uppercase tracking-[1px] shadow-button transition-all duration-300 ease-out hover:bg-btn-green hover:shadow-button-hover disabled:transform-none disabled:cursor-not-allowed disabled:bg-light disabled:shadow-none"
        onClick={startGame}
        disabled={startButtonDisabled()}
      >
        Start Game
      </button>
    </div>
  );
}

export default App;
