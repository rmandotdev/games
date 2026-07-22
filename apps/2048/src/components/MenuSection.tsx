import { Show } from "solid-js";

import Button from "./ui/Button";

type MenuSectionProps = {
  inMenu: boolean;
  onStartGame(): void;
  onResumeGame(): void;
  isGameOver: boolean;
};

function MenuSection(props: MenuSectionProps) {
  return (
    <Show when={props.inMenu}>
      <div class="flex flex-col items-center">
        <Button label="Start Game" onClick={props.onStartGame} />
        <Button
          label="Resume Game"
          onClick={props.onResumeGame}
          disabled={props.isGameOver}
        />
      </div>
    </Show>
  );
}

export default MenuSection;
