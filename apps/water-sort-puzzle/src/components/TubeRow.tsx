import { For } from "solid-js";
import type { TubeProps } from "./Tube";
import Tube from "./Tube";

function TubeRow(props: { tubes: TubeProps[] }) {
  return (
    <div class="tube-row flex justify-center">
      <For each={props.tubes}>
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
