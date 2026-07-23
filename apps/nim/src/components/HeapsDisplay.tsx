import { For } from "solid-js";

type HeapsDisplayProps =
  | { heaps: number[]; selectedHeap?: number | null; interactive?: false }
  | {
      heaps: number[];
      selectedHeap: number | null;
      selectHeap(index: number): void;
      interactive: true;
    };

function HeapsDisplay(props: HeapsDisplayProps) {
  return (
    <div class="heaps-display">
      <For each={props.heaps}>
        {(count, index) => (
          <div
            id="turn-indicator"
            class="heap flex flex-col items-center p-6 rounded-10 relative"
            classList={{
              selectable: props.interactive && count > 0,
              selected: props.selectedHeap === index(),
            }}
            data-heap={index()}
            onClick={() =>
              props.interactive && count > 0 && props.selectHeap(index())
            }
          >
            <div class="heap-label">
              <span>{count}</span> stones
            </div>
            <div class="stones">
              <For each={Array(count).fill(0)}>
                {() => <div class="stone" />}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

export default HeapsDisplay;
