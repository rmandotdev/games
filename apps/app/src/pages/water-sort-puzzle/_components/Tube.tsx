import { For } from "solid-js";

import type { TubeType } from "../_types";

import Liquid from "./Liquid";

const Tube = (props: {
  tube: TubeType;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div
    class="tube"
    style={{
      border: props.isSelected ? "2px solid #FFD700" : "2px solid #000",
    }}
    onClick={props.onClick}
  >
    <For each={props.tube}>{(color) => <Liquid color={color} />}</For>
  </div>
);

export default Tube;
