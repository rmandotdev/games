import type { GameMode } from "#types";

import Button from "./ui/Button";

function MenuContainer(props: { startNewGame: (gameMode?: GameMode) => void }) {
  return (
    <div class="mx-auto my-0 flex w-full max-w-container flex-col items-center">
      <Button label="Play Daily" onClick={() => props.startNewGame("daily")} />
      <Button
        label="Play Unlimited"
        onClick={() => props.startNewGame("unlimited")}
      />
    </div>
  );
}

export default MenuContainer;
