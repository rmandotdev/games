import { onMount, Switch, Match } from "solid-js";

import { useGame } from "~/hooks/useGame";

import TopBar from "./TopBar";

import MenuContainer from "./MenuContainer";
import GameContainer from "./GameContainer";
import StatsContainer from "./StatsContainer";
import SettingsContainer from "./SettingsContainer";
import LeaderboardContainer from "./LeaderboardContainer";

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

    startNewGame,

    handleBoardAction,

    init,
  } = useGame();

  onMount(init);

  return (
    <div id="main-container">
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
