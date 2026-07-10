import { For } from "solid-js";

import type { TubeType } from "~/types";

import Liquid from "./Liquid";

function Tube(props: {
  tube: TubeType;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
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
}

export default Tube;
