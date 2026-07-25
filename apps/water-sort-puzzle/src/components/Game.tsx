import { onMount, Show } from "solid-js";
import levels from "#data/levels";
import { useGame } from "#hooks/useGame";
import ControlButton from "./ControlButton";
import TubesContainer from "./TubesContainer";

function App() {
  const {
    currentLevel,
    message,
    previousLevel,
    nextLevel,
    restartLevelDisabled,
    tubesСontainerHidden,
    loadLevel,
    selectTube,
    selectedTubeIndex,
    tubes,
    initGame,
  } = useGame();

  onMount(initGame);

  return (
    <>
      <div class="flex min-h-[80vh] flex-col text-center">
        <div
          id="top-menu"
          class="flex items-center justify-center font-bold text-white"
        >
          <ControlButton
            label="Previous Level"
            onClick={previousLevel}
            disabled={currentLevel() === 0}
            icon={
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            }
          />

          <span class="flex items-center justify-center">
            Level {currentLevel() + 1}
          </span>

          <ControlButton
            label="Next Level"
            onClick={nextLevel}
            disabled={currentLevel() === levels.length - 1}
            icon={
              <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
            }
          />

          <ControlButton
            label="Restart Level"
            onClick={loadLevel}
            disabled={restartLevelDisabled()}
            icon={
              <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            }
          />
        </div>

        <TubesContainer
          tubes={tubes()}
          selectedTubeIndex={selectedTubeIndex()}
          selectTube={selectTube}
          hidden={tubesСontainerHidden()}
        />
      </div>

      <Show when={message()}>
        <div id="message" class="font-bold text-white">
          {message()}
        </div>
      </Show>
    </>
  );
}

export default App;
