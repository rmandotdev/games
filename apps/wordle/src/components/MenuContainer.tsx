import type { GameMode } from "#types";

import Button from "./ui/Button";

function MenuContainer(props: { startNewGame: (gameMode?: GameMode) => void }) {
  return (
    <div
      class="w-full flex flex-col items-center my-0 mx-auto"
      style={{ "max-width": "var(--content-max-width)" }}
    >
      <Button label="Play Daily" onClick={() => props.startNewGame("daily")} />
      <Button
        label="Play Unlimited"
        onClick={() => props.startNewGame("unlimited")}
      />
    </div>
  );
}

export default MenuContainer;
