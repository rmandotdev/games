import type { GameMode } from "#types";

import Button from "./ui/Button";

function MenuContainer(props: { startNewGame: (gameMode?: GameMode) => void }) {
  return (
    <div class="max-w-container mx-auto my-0 flex w-full flex-col items-center">
      <Button label="Play Daily" onClick={() => props.startNewGame("daily")} />
      <Button
        label="Play Unlimited"
        onClick={() => props.startNewGame("unlimited")}
      />
    </div>
  );
}

export default MenuContainer;
