import { For, Show } from "solid-js";

type HistoryProps = {
  history: {
    guess: string;
    bulls: number;
    cows: number;
  }[];
};

function History(props: HistoryProps) {
  return (
    <Show when={props.history.length > 0}>
      <div id="history">
        <div class="history-header">
          <div>#</div>
          <div>Guess</div>
          <div>Bulls</div>
          <div>Cows</div>
        </div>
        <For each={props.history}>
          {(entry, index) => (
            <div class="history-entry">
              <div>{index() + 1}</div>
              <div>{entry.guess}</div>
              <div>{entry.bulls}</div>
              <div>{entry.cows}</div>
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}

export default History;
