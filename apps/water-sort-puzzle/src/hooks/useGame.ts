import { createSignal } from "solid-js";
import CONFIG from "#config";
import levels from "#data/levels";
import { canPour, checkWin, pour } from "#lib/game";
import type { TubeType } from "#types";

export function useGame() {
  const [currentLevel, setCurrentLevel] = createSignal<number>(0);
  const [tubes, setTubes] = createSignal<TubeType[]>([]);
  const [selectedTubeIndex, setSelectedTubeIndex] = createSignal<number | null>(
    null,
  );

  const [message, setMessage] = createSignal<string>();

  const [restartLevelDisabled, setRestartLevelDisabled] =
    createSignal<boolean>(false);
  const [tubesСontainerHidden, setTubesСontainerHidden] =
    createSignal<boolean>(false);

  function saveData() {
    localStorage.setItem(
      CONFIG.storageKey,
      JSON.stringify({ currentLevel: currentLevel() }),
    );
  }

  function loadData() {
    const data = localStorage.getItem(CONFIG.storageKey);
    if (data) {
      setCurrentLevel(JSON.parse(data)?.currentLevel ?? 0);
    } else {
      setCurrentLevel(0);
    }
  }

  function updateTubeSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const tubesCount = tubes().length;
    let rowCount = 1;
    if (tubesCount > 15) {
      rowCount = 3;
    } else if (tubesCount > 7) {
      rowCount = 2;
    }
    const tubesPerRow = Math.ceil(tubesCount / rowCount);
    // Calculate new sizes based on window width and number of tubes per row
    let newTubeWidth = Math.min(90, windowWidth / tubesPerRow - 90 / 4);
    let newTubeHeight = newTubeWidth * 3.5; // Maintain aspect ratio
    let newTubesGap = newTubeWidth / 4;
    let newTubeBorderRadius = newTubeWidth / 3;
    // Ensure the tubes fit vertically
    const totalHeight = (newTubeHeight + 2 * newTubesGap) * rowCount;
    if (totalHeight > windowHeight * 0.8) {
      const scale = (windowHeight * 0.8) / totalHeight;
      newTubeWidth *= scale;
      newTubeHeight *= scale;
      newTubesGap *= scale;
      newTubeBorderRadius *= scale;
    }
    // Ensure minimum sizes
    newTubeWidth = Math.max(40, newTubeWidth);
    newTubeHeight = newTubeWidth * 3.5;
    newTubesGap = newTubeWidth / 4;
    newTubeBorderRadius = newTubeWidth / 3;
    // Update CSS variables
    document.documentElement.style.setProperty(
      "--tube-width",
      `${newTubeWidth}px`,
    );
    document.documentElement.style.setProperty(
      "--tube-height",
      `${newTubeHeight}px`,
    );
    document.documentElement.style.setProperty(
      "--tubes-gap",
      `${newTubesGap}px`,
    );
    document.documentElement.style.setProperty(
      "--tube-border-radius",
      `${newTubeBorderRadius}px`,
    );

    // Update top menu sizes based on window width
    const newTopMenuFontSize = Math.max(16, Math.min(36, windowWidth * 0.09));
    const newControlButtonSize = Math.max(24, Math.min(54, windowWidth * 0.12));
    const newTopMenuGap = Math.max(10, Math.min(20, windowWidth * 0.04));
    document.documentElement.style.setProperty(
      "--top-menu-font-size",
      `${newTopMenuFontSize}px`,
    );
    document.documentElement.style.setProperty(
      "--control-button-size",
      `${newControlButtonSize}px`,
    );
    document.documentElement.style.setProperty(
      "--top-menu-gap",
      `${newTopMenuGap}px`,
    );
  }

  function selectTube(index: number) {
    const selectedTube = selectedTubeIndex();
    if (selectedTube === null) {
      if (tubes()[index]!.length > 0) {
        setSelectedTubeIndex(index);
      }
    } else {
      if (canPour(tubes(), selectedTube, index)) {
        pour(tubes(), selectedTube, index);
        setRestartLevelDisabled(false);
        setTubes(tubes());
        if (checkWin(tubes())) {
          setCurrentLevel(currentLevel() + 1);
          saveData();
          loadLevel();
        }
      }
      setSelectedTubeIndex(null);
    }
  }

  function loadLevel() {
    setRestartLevelDisabled(true);
    if (currentLevel() >= levels.length) {
      setTubesСontainerHidden(true);
      setMessage(CONFIG.finalMessage);
      return;
    }
    const levelTubes = structuredClone(levels[currentLevel()]!);
    setTubes(levelTubes);
  }

  function previousLevel() {
    if (currentLevel() > 0) {
      setCurrentLevel(currentLevel() - 1);
      saveData();
      loadLevel();
    }
  }

  function nextLevel() {
    if (currentLevel() < levels.length - 1) {
      setCurrentLevel(currentLevel() + 1);
      saveData();
      loadLevel();
    }
  }

  function initGame() {
    window.addEventListener("resize", updateTubeSize);

    loadData();
    loadLevel();
    updateTubeSize();
  }

  return {
    currentLevel,
    message,
    previousLevel,
    nextLevel,
    restartLevelDisabled,
    tubesСontainerHidden,
    loadLevel,
    tubes,
    selectTube,
    selectedTubeIndex,
    initGame,
  };
}
