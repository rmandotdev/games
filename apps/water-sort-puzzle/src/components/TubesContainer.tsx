import type { JSXElement } from "solid-js";
import { For } from "solid-js";

import type { TubeType } from "#types";
import type { TubeProps } from "./Tube";
import TubeRow from "./TubeRow";

function getRows(props: {
  tubes: TubeType[];
  selectedTubeIndex: number | null;
  selectTube(index: number): void;
}) {
  const tubeCount = props.tubes.length;

  const rowCount = (() => {
    if (tubeCount > 15) {
      return 3;
    } else if (tubeCount > 7) {
      return 2;
    } else {
      return 1;
    }
  })();

  const tubesPerRow = Math.ceil(tubeCount / rowCount);

  const rows: TubeProps[][] = [];

  for (let i = 0; i < rowCount; i++) {
    const row: TubeProps[] = [];

    for (let j = 0; j < tubesPerRow && i * tubesPerRow + j < tubeCount; j++) {
      const tubeIndex = i * tubesPerRow + j;
      row.push({
        tube: props.tubes[tubeIndex]!,
        isSelected: tubeIndex === props.selectedTubeIndex,
        onClick: () => props.selectTube(tubeIndex),
      });
    }

    rows.push(row);
  }

  return rows;
}

function TubesContainer(props: {
  tubes: TubeType[];
  selectedTubeIndex: number | null;
  selectTube: (index: number) => void;
  hidden: boolean;
}): JSXElement {
  const rows = () =>
    getRows({
      tubes: props.tubes,
      selectedTubeIndex: props.selectedTubeIndex,
      selectTube: props.selectTube,
    });

  return (
    <div
      id="tubes-container"
      class="flex grow flex-col items-center justify-center"
      style={{ visibility: props.hidden ? "hidden" : "visible" }}
    >
      <For each={rows()}>{(row) => <TubeRow tubes={row} />}</For>
    </div>
  );
}

export default TubesContainer;
