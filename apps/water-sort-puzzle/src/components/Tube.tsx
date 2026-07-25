import { For } from "solid-js";

import type { TubeType } from "#types";

import Liquid from "./Liquid";

export interface TubeProps {
  tube: TubeType;
  isSelected: boolean;
  onClick(): void;
}

function Tube(props: TubeProps) {
  return (
    <div
      class="tube flex cursor-pointer flex-col-reverse overflow-hidden border-2 border-black bg-white/70"
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
