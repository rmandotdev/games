import { Show } from "solid-js";
import type { Component } from "solid-js";

type MenuSectionProps = {
  showMenu: boolean;
  startNewGame: () => void;
};

const MenuSection: Component<MenuSectionProps> = (props) => {
  return (
    <Show when={props.showMenu}>
      <div id="menu-section" class="section">
        <button id="start-game-button" onClick={props.startNewGame}>
          NEW GAME
        </button>
      </div>
    </Show>
  );
};

export default MenuSection;
