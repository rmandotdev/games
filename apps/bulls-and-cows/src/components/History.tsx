import { For } from "solid-js";

export type HistoryItem = { guess: string; bulls: number; cows: number };

type HistoryProps = {
  history: HistoryItem[];
};

function History(props: HistoryProps) {
  return (
    <div class="my-2.5 text-left max-h-50 overflow-y-auto p-2.5 bg-app-200 dark:bg-app-900 border border-solid border-app-400 dark:border-app-700 scrollbar-custom">
      <div class="grid grid-cols-history gap-2.5 p-2 font-bold mb-2.5 border-black dark:border-light border-2 border-solid">
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
