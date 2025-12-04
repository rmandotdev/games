import { For } from "solid-js";

import type { TubeType } from "../_types";

import Tube from "./Tube";

const TubeRow = (props: {
  tubeArray: {
    tube: TubeType;
    isSelected: boolean;
    onClick: () => void;
  }[];
}) => (
  <div class="tube-row">
    <For each={props.tubeArray}>
      {(tube) => (
        <Tube
          tube={tube.tube}
          isSelected={tube.isSelected}
          onClick={tube.onClick}
        />
      )}
    </For>
  </div>
);

export default TubeRow;
