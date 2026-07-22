import { Show } from "solid-js";

type MenuSectionProps = {
  showMenu: boolean;
  startNewGame: () => void;
};

function MenuSection(props: MenuSectionProps) {
  return (
    <Show when={props.showMenu}>
      <div class="justify-items-center text-center items-center">
        <button
          class="whitespace-nowrap inline-block text-white border-0 rounded-[5px] cursor-pointer text-base bg-btn hover:bg-btn-hover"
          style={{ margin: "10px", padding: "10px min(20px, 10%)" }}
          onClick={props.startNewGame}
        >
          NEW GAME
        </button>
      </div>
    </Show>
  );
}

export default MenuSection;
