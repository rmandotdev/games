import { Match, onMount, Switch } from "solid-js";
import { Portal } from "solid-js/web";

import { useGame } from "#hooks/useGame";
import GameContainer from "./GameContainer";
import LeaderboardContainer from "./LeaderboardContainer";
import MenuContainer from "./MenuContainer";
import NotificationPopup from "./NotificationPopup";
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
    <div class="w-[95%] flex flex-col items-center my-0 mx-auto text-dark dark:text-light max-w-container">
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

      <Portal>
        <NotificationPopup />
      </Portal>
    </div>
  );
}

export default App;
