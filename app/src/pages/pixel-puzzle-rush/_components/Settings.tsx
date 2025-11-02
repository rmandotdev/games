import { Show } from "solid-js";
import type { Component } from "solid-js";
import type { CurrentState } from "../_types";

type SettingsProps = {
  currentState: CurrentState;
  gridSizeInput: string;
  setGridSizeInput: (_: string) => void;
  colorCountInput: string;
  setColorCountInput: (_: string) => void;
};

const Settings: Component<SettingsProps> = (props) => {
  return (
    <Show when={props.currentState === "menu"}>
      <div id="settings" class="no-select">
        <select
          id="grid-size"
          value={props.gridSizeInput}
          onChange={(e) => props.setGridSizeInput(e.target.value)}
        >
          <option value="2">2x2</option>
          <option value="3">3x3</option>
          <option value="4" selected>
            4x4
          </option>
          <option value="5">5x5</option>
          <option value="6">6x6</option>
          <option value="7">7x7</option>
          <option value="8">8x8</option>
          <option value="9">9x9</option>
          <option value="10">10x10</option>
        </select>

        <select
          id="color-count"
          value={props.colorCountInput}
          onChange={(e) => props.setColorCountInput(e.target.value)}
        >
          <option value="2">2 colors</option>
          <option value="3">3 colors</option>
          <option value="4" selected>
            4 colors
          </option>
          <option value="5">5 colors</option>
          <option value="6">6 colors</option>
          <option value="7">7 colors</option>
        </select>
      </div>
    </Show>
  );
};

export default Settings;
