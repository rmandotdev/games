import { Show } from "solid-js";
import type { SharePopupData } from "#components/SharePopup";
import type { BoardAction, KeyColor, Settings, State, TileInfo } from "#types";

import GameBoard from "./GameBoard";
import Keyboard from "./Keyboard";
import SharePopup from "./SharePopup";

import Button from "./ui/Button";

function GameContainer(props: {
  tiles: TileInfo[];
  keycolors: Record<string, KeyColor>;
  state: State;
  settings: Settings;
  handleBoardAction: (action: BoardAction) => void;

  startNewGame: () => void;

  sharePopup: SharePopupData | null;
  onCloseSharePopup: () => void;
}) {
  return (
    <div class="relative mx-auto my-0 flex w-full max-w-container flex-col items-center">
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

      <Show when={props.sharePopup} keyed>
        {(data) => <SharePopup data={data} onClose={props.onCloseSharePopup} />}
      </Show>
    </div>
  );
}

export default GameContainer;
