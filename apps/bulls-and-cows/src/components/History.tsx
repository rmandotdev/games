import { For } from "solid-js";

export type HistoryItem = { guess: string; bulls: number; cows: number };

type HistoryProps = {
  history: HistoryItem[];
};

function History(props: HistoryProps) {
  return (
    <div class="scrollbar-custom border-app-400 bg-app-200 dark:border-app-700 dark:bg-app-900 my-2.5 max-h-56 overflow-y-auto border border-solid p-2.5 text-left">
      <div class="grid-cols-history dark:border-light mb-2.5 grid gap-2.5 border-2 border-solid border-black p-2 font-bold">
        <div>#</div>
        <div>Guess</div>
        <div>Bulls</div>
        <div>Cows</div>
      </div>
      <div class="divide-app-300 dark:divide-app-800 divide-y">
        <For each={props.history}>
          {(entry, index) => (
            <div class="grid-cols-history grid gap-2.5 py-1.5">
              <div>{index() + 1}</div>
              <div>{entry.guess}</div>
              <div>{entry.bulls}</div>
              <div>{entry.cows}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default History;
