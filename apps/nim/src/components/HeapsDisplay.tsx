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
    <div class="flex justify-between">
      <For each={props.heaps}>
        {(count, index) => (
          // biome-ignore lint/a11y: Needs to be fixed
          <div
            class="heap relative mt-0 flex cursor-not-allowed touch-manipulation flex-col items-center rounded-10 border-2 border-transparent bg-white/5 p-6 text-primary text-xl transition-all duration-300 ease-out"
            classList={{
              "cursor-pointer": props.interactive && count > 0,
              "border-primary -translate-y-1.25 bg-primary/10 shadow-5-15-primary-20":
                props.selectedHeap === index(),
              "hover:-translate-0.5 hover:border-primary/30":
                props.interactive &&
                count > 0 &&
                props.selectedHeap !== index(),
            }}
            data-heap={index()}
            onClick={() =>
              props.interactive && count > 0 && props.selectHeap(index())
            }
          >
            <div class="mb-4 inline-block rounded-lg bg-black/20 px-4 py-2 text-lg text-primary">
              <span>{count}</span> stones
            </div>
            <div class="grid h-stones-h w-stones-w grid-cols-stones content-start gap-stones-gap rounded-lg bg-black/20 p-4">
              <For each={Array(count).fill(0)}>
                {() => (
                  <div class="relative size-stone rounded-full bg-gradient-stone shadow-2-4-20 transition-all duration-300 ease-out" />
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

export default HeapsDisplay;
