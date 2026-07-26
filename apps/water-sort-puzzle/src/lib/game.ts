import CONFIG from "#config";
import type { TubeType } from "#types";

export function canPour(
  tubes: readonly TubeType[],
  from: number,
  to: number,
): boolean {
  if (from === to) return false;

  const tubesFrom = tubes[from]!;
  const tubesTo = tubes[to]!;

  if (tubesFrom.length === 0) return false;
  if (tubesTo.length === CONFIG.tubeCapacity) return false;
  if (tubesTo.length === 0) return true;

  return tubesFrom[tubesFrom.length - 1] === tubesTo[tubesTo.length - 1];
}

export function pour(
  tubes: readonly TubeType[],
  from: number,
  to: number,
): void {
  const tubesFrom = tubes[from]!;
  const tubesTo = tubes[to]!;

  const colorToPour = tubesFrom[tubesFrom.length - 1];

  while (
    tubesFrom.length > 0 &&
    tubesTo.length < CONFIG.tubeCapacity &&
    tubesFrom[tubesFrom.length - 1] === colorToPour
  ) {
    tubesTo.push(tubesFrom.pop()!);
  }
}

export function checkWin(tubes: readonly TubeType[]): boolean {
  return tubes.every((tube) => {
    return (
      tube.length === 0 ||
      (tube.length === CONFIG.tubeCapacity &&
        tube.every((color) => color === tube[0]))
    );
  });
}
