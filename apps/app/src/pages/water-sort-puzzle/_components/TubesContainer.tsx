import { For } from "solid-js";

import type { JSXElement } from "solid-js";

import type { TubeType, Color } from "../_types";

import TubeRow from "./TubeRow";

type TubeParams = {
  tube: Color[];
  isSelected: boolean;
  onClick: () => void;
};

function getRows(props: {
  tubes: TubeType[];
  selectedTubeIndex: number | null;
  selectTube: (index: number) => void;
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

  const rows: TubeParams[][] = [];

  for (let i = 0; i < rowCount; i++) {
    const row: TubeParams[] = [];

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

const TubesContainer = (props: {
  tubes: TubeType[];
  selectedTubeIndex: number | null;
  selectTube: (index: number) => void;
  hidden: boolean;
}): JSXElement => {
  const rows = () =>
    getRows({
      tubes: props.tubes,
      selectedTubeIndex: props.selectedTubeIndex,
      selectTube: props.selectTube,
    });

  return (
    <div
      id="tubes-container"
      style={{ visibility: props.hidden ? "hidden" : "visible" }}
    >
      <For each={rows()}>{(row) => <TubeRow tubeArray={row} />}</For>
    </div>
  );
};

export default TubesContainer;
