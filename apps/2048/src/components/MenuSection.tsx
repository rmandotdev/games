import type { Component } from "solid-js";
import { Show } from "solid-js";

type MenuSectionProps = {
  inMenu: boolean;
  onStartGame: () => void;
  onResumeGame: () => void;
  isGameOver: boolean;
};

const MenuSection: Component<MenuSectionProps> = (props) => {
  return (
    <Show when={props.inMenu}>
      <div id="menu-section" class="section">
        <button onClick={props.onStartGame} id="start-game">
          Start Game
        </button>
        <button
          onClick={props.onResumeGame}
          id="resume-game"
          disabled={props.isGameOver}
        >
          Resume Game
        </button>
      </div>
    </Show>
  );
};

export default MenuSection;
