import { For } from "solid-js";

import type { TubeType } from "~/types";

import Tube from "./Tube";

function TubeRow(props: {
  tubeArray: {
    tube: TubeType;
    isSelected: boolean;
    onClick: () => void;
  }[];
}) {
  return (
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
}

export default TubeRow;
