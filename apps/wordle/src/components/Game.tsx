import { Match, onMount, Switch } from "solid-js";

import { useGame } from "#hooks/useGame";
import GameContainer from "./GameContainer";
import LeaderboardContainer from "./LeaderboardContainer";
import MenuContainer from "./MenuContainer";
import SettingsContainer from "./SettingsContainer";
import StatsContainer from "./StatsContainer";
import TopBar from "./TopBar";

function App() {
  const {
    getState,

    currentSection,
    setCurrentSection,

    getStats,

    getSettings,
    updateSettings,

    getTiles,
    getKeyColors,

    getSharePopup,
    setSharePopup,

    startNewGame,

    handleBoardAction,

    init,
  } = useGame();

  onMount(init);

  return (
    <div class="mx-auto my-0 flex w-[95%] max-w-container flex-col items-center text-dark dark:text-light">
      <TopBar
        currentSection={currentSection()}
        setCurrentSection={setCurrentSection}
      />

      <Switch>
        <Match when={currentSection() === "menu"}>
          <MenuContainer startNewGame={startNewGame} />
        </Match>

        <Match when={currentSection() === "game"}>
          <GameContainer
            settings={getSettings()}
            startNewGame={() => startNewGame("unlimited")}
            tiles={getTiles()}
            keycolors={getKeyColors()}
            handleBoardAction={handleBoardAction}
            state={getState()}
            sharePopup={getSharePopup()}
            onCloseSharePopup={() => setSharePopup(null)}
          />
        </Match>

        <Match when={currentSection() === "stats"}>
          <StatsContainer stats={getStats()} />
        </Match>

        <Match when={currentSection() === "settings"}>
          <SettingsContainer
            settings={getSettings()}
            updateSettings={updateSettings}
          />
        </Match>

        <Match when={currentSection() === "leaderboard"}>
          <LeaderboardContainer />
        </Match>
      </Switch>
    </div>
  );
}

export default App;
