import { For, Show } from "solid-js";
import type { Component } from "solid-js";

type HistoryProps = {
  history: {
    guess: string;
    bulls: number;
    cows: number;
  }[];
};

const History: Component<HistoryProps> = (props) => {
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
};

export default History;
