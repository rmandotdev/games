import { For } from "solid-js";

export type HistoryItem = { guess: string; bulls: number; cows: number };

type HistoryProps = {
  history: HistoryItem[];
};

function History(props: HistoryProps) {
  return (
    <div class="scrollbar-custom my-2.5 max-h-50 overflow-y-auto border border-app-400 border-solid bg-app-200 p-2.5 text-left dark:border-app-700 dark:bg-app-900">
      <div class="mb-2.5 grid grid-cols-history gap-2.5 border-2 border-black border-solid p-2 font-bold dark:border-light">
        <div>#</div>
        <div>Guess</div>
        <div>Bulls</div>
        <div>Cows</div>
      </div>
      <div class="divide-y divide-app-300 dark:divide-app-800">
        <For each={props.history}>
          {(entry, index) => (
            <div class="grid grid-cols-history gap-2.5 py-1.5">
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
