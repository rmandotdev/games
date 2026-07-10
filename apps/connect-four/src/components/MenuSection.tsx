import { Show } from "solid-js";

type MenuSectionProps = {
  showMenu: boolean;
  startNewGame: () => void;
};

function MenuSection(props: MenuSectionProps) {
  return (
    <Show when={props.showMenu}>
      <div id="menu-section" class="section">
        <button id="start-game-button" onClick={props.startNewGame}>
          NEW GAME
        </button>
      </div>
    </Show>
  );
}

export default MenuSection;
