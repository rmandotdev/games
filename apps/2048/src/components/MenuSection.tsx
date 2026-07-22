import { Show } from "solid-js";

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
        <button
          class="text-base py-2.5 px-5 m-2.5 cursor-pointer bg-btn text-btn-text border-0 rounded-[5px] flex items-center justify-center"
          onClick={props.onStartGame}
        >
          Start Game
        </button>
        <button
          class="text-base py-2.5 px-5 m-2.5 cursor-pointer bg-btn text-btn-text border-0 rounded-[5px] flex items-center justify-center"
          onClick={props.onResumeGame}
          disabled={props.isGameOver}
        >
          Resume Game
        </button>
      </div>
    </Show>
  );
}

export default MenuSection;
