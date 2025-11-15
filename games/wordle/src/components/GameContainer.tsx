import { Show } from "solid-js";

import type { Settings, BoardAction, TileInfo, KeyColor, State } from "~/types";

import GameBoard from "./GameBoard";
import Keyboard from "./Keyboard";

import Button from "./ui/Button";

const GameContainer = (props: {
  tiles: TileInfo[];
  keycolors: Record<string, KeyColor>;
  state: State;
  settings: Settings;
  handleBoardAction: (action: BoardAction) => void;

  startNewGame: () => void;
}) => (
  <div class="content-container">
    <GameBoard tiles={props.tiles} />

    <Show when={props.state === "playing"}>
      <Keyboard
        settings={props.settings}
        keycolors={props.keycolors}
        handleBoardAction={props.handleBoardAction}
      />
    </Show>

    <Show when={props.state === "gameover"}>
      <Button label="New Game" onClick={props.startNewGame} />
    </Show>
  </div>
);

export default GameContainer;
