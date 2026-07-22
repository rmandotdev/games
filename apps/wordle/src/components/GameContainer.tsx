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
    <div class="relative w-full flex flex-col items-center my-0 mx-auto max-w-container">
      <GameBoard tiles={props.tiles} />

      <Show when={props.state === "playing"}>
        <Keyboard
          settings={props.settings}
          keycolors={props.keycolors}
          handleBoardAction={props.handleBoardAction}
        />
      </Show>

      <Show when={props.state === "gameover"}>
        <Button label="New Game" class="mt-5" onClick={props.startNewGame} />
      </Show>

      <Show when={props.sharePopup}>
        <SharePopup
          data={props.sharePopup!}
          onClose={props.onCloseSharePopup}
        />
      </Show>
    </div>
  );
}

export default GameContainer;
