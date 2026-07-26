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
    <div class="mt-5 flex select-none justify-center">
      <Show when={props.currentState === "menu"}>
        <button onClick={props.startGame}>Start Game</button>
      </Show>

      <Show when={props.currentState !== "menu"}>
        <button onClick={props.pauseGame}>
          {props.currentState === "paused" ? "Resume" : "Pause"}
        </button>

        <button class="bg-dark-red hover:bg-red" onClick={props.cancelGame}>
          Cancel
        </button>
      </Show>

      <Show when={props.currentState === "finished"}>
        <button onClick={props.showMenu}>Main Menu</button>
      </Show>
    </div>
  );
}

export default Controls;
