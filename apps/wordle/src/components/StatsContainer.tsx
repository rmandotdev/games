import { For } from "solid-js";
import type { Stats } from "#types";

function GuessDistributionRow(props: { v: number; i: number; p: number }) {
  return (
    <div class="flex items-center w-9/10">
      <div class="w-5 text-right mr-2.5 font-bold text-base">{props.i + 1}</div>
      <div class="grow h-7.5 relative rounded-sm bg-absent">
        <div
          class="h-full rounded-sm bg-correct"
          style={{
            width: `${props.p}%`,
          }}
        />
        <div class="absolute right-[5px] top-1/2 font-bold text-base text-dark -translate-y-1/2">
          {props.v}
        </div>
      </div>
    </div>
  );
}

function GuessDistribution(props: { guessDistribution: number[] }) {
  return (
    <div class="flex flex-col gap-[5px] w-full">
      <For each={props.guessDistribution}>
        {(v, i) => (
          <GuessDistributionRow
            v={v}
            i={i()}
            p={(v / Math.max(...props.guessDistribution, 1)) * 100}
          />
        )}
      </For>
    </div>
  );
}

function StatBox(props: {
  id?: string;
  value: string | number;
  label: string;
}) {
  return (
    <div class="border-2 border-solid border-border-light dark:border-border-dark bg-content-bg dark:bg-content-bg-dark rounded-[5px] p-2.5 text-center">
      <div class="text-2xl font-bold mb-[5px]" id={props.id}>
        {props.value}
      </div>
      <div class="text-base">{props.label}</div>
    </div>
  );
}

const getNormalizedPercentage = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 100);

function StatsContainer(props: { stats: Stats }) {
  return (
    <div class="w-full flex flex-col items-center my-0 mx-auto max-w-container">
      <div class="grid grid-cols-2 gap-5 mb-5">
        <StatBox label="Played" value={props.stats.gamesPlayed} />

        <StatBox
          label="Win %"
          value={`${getNormalizedPercentage(
            props.stats.gamesWon,
            props.stats.gamesPlayed,
          )}%`}
        />

        <StatBox label="Current Streak" value={props.stats.currentStreak} />

        <StatBox label="Max Streak" value={props.stats.maxStreak} />
      </div>

      <h3 class="font-bold text-lg text-center my-2.5">Guess Distribution</h3>

      <GuessDistribution guessDistribution={props.stats.guessDistribution} />
    </div>
  );
}

export default StatsContainer;
