import { For } from "solid-js";

function PixelGrid(props: {
  grid: string[];
  gridSize: number;
  handleGridClick?(index: number): void;
}) {
  return (
    <div
      class="m-2.5 inline-grid gap-0.5 select-none"
      style={{ "grid-template-columns": `repeat(${props.gridSize}, 1fr)` }}
    >
      <For each={props.grid}>
        {(color, index) => (
          <div
            class="border-border size-10 cursor-pointer touch-manipulation border"
            style={{ "background-color": color }}
            onClick={() => props.handleGridClick?.(index())}
          />
        )}
      </For>
    </div>
  );
}

export default PixelGrid;
