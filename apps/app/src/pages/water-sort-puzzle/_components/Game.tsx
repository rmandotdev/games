import { onMount, Show } from "solid-js";

import { useGame } from "../_hooks/useGame";

import levels from "../_data/levels";

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
      <div id="game-container">
        <div id="top-menu">
          <button
            id="previous-level"
            class="control-button"
            onClick={previousLevel}
            disabled={currentLevel() === 0}
          />

          <span id="currrent-level">Level {currentLevel() + 1}</span>

          <button
            id="next-level"
            class="control-button"
            onClick={nextLevel}
            disabled={currentLevel() === levels.length - 1}
          />

          <button
            id="restart-level"
            class="control-button"
            onClick={loadLevel}
            disabled={restartLevelDisabled()}
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
        <div id="message">{message()}</div>
      </Show>
    </>
  );
}

export default App;
