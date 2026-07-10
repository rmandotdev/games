import type { GameMode } from "#types";

import Button from "./ui/Button";

function MenuContainer(props: { startNewGame: (gameMode?: GameMode) => void }) {
  return (
    <div id="menu-container" class="content-container">
      <Button label="Play Daily" onClick={() => props.startNewGame("daily")} />
      <Button
        label="Play Unlimited"
        onClick={() => props.startNewGame("unlimited")}
      />
    </div>
  );
}

export default MenuContainer;
