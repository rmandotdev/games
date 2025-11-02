import { Show } from "solid-js";
import type { Component } from "solid-js";
import type { CurrentState } from "../_types";

type ControlsProps = {
  currentState: CurrentState;
  startGame: () => void;
  pauseGame: () => void;
  cancelGame: () => void;
  showMenu: () => void;
};

const Controls: Component<ControlsProps> = (props) => {
  return (
    <div id="controls" class="no-select">
      <Show when={props.currentState === "menu"}>
        <button id="start" onClick={props.startGame}>
          Start Game
        </button>
      </Show>

      <Show
        when={
          props.currentState === "playing" || props.currentState === "paused"
        }
      >
        <button id="pause" onClick={props.pauseGame}>
          {props.currentState === "paused" ? "Resume" : "Pause"}
        </button>

        <button id="cancel" onClick={props.cancelGame}>
          Cancel
        </button>
      </Show>

      <Show when={props.currentState === "finished"}>
        <button id="menu-button" onClick={props.showMenu}>
          Main Menu
        </button>
      </Show>
    </div>
  );
};

export default Controls;
