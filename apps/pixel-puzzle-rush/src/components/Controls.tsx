import { Show } from "solid-js";
import type { CurrentState } from "#types";

interface ControlsProps {
  currentState: CurrentState;
  startGame(): void;
  pauseGame(): void;
  cancelGame(): void;
  showMenu(): void;
}

function Controls(props: ControlsProps) {
  return (
    <div class="mt-5 flex justify-center select-none">
      <Show when={props.currentState === "menu"}>
        <button onClick={props.startGame} type="button">
          Start Game
        </button>
      </Show>

      <Show
        when={
          props.currentState === "playing" || props.currentState === "paused"
        }
      >
        <button onClick={props.pauseGame} type="button">
          {props.currentState === "paused" ? "Resume" : "Pause"}
        </button>

        <button
          class="bg-dark-red hover:bg-red"
          onClick={props.cancelGame}
          type="button"
        >
          Cancel
        </button>
      </Show>

      <Show when={props.currentState === "finished"}>
        <button onClick={props.showMenu} type="button">
          Main Menu
        </button>
      </Show>
    </div>
  );
}

export default Controls;
