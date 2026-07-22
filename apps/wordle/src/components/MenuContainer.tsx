import type { GameMode } from "#types";

import Button from "./ui/Button";

function MenuContainer(props: { startNewGame: (gameMode?: GameMode) => void }) {
  return (
    <div class="w-full flex flex-col items-center my-0 mx-auto max-w-container">
      <Button
        label="Play Daily"
        class="mt-5"
        onClick={() => props.startNewGame("daily")}
      />
      <Button
        label="Play Unlimited"
        class="mt-5"
        onClick={() => props.startNewGame("unlimited")}
      />
    </div>
  );
}

export default MenuContainer;
