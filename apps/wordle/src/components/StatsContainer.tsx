import { For } from "solid-js";
import type { Stats } from "#types";

function GuessDistributionRow(props: { v: number; i: number; p: number }) {
  return (
    <div class="flex w-9/10 items-center">
      <div class="mr-2.5 w-5 text-right text-base font-bold">{props.i + 1}</div>
      <div class="bg-absent relative h-7.5 grow rounded-sm">
        <div
          class="bg-correct h-full rounded-sm"
          style={{
            width: `${props.p}%`,
          }}
        />
        <div class="text-dark absolute top-1/2 right-[5px] -translate-y-1/2 text-base font-bold">
          {props.v}
        </div>
      </div>
    </div>
  );
}

function GuessDistribution(props: { guessDistribution: number[] }) {
  return (
    <div class="flex w-full flex-col gap-[5px]">
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
    <div class="border-border-light bg-content-bg dark:border-border-dark dark:bg-content-bg-dark rounded-[5px] border-2 border-solid p-2.5 text-center">
      <div class="mb-[5px] text-2xl font-bold" id={props.id}>
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
    <div class="max-w-container mx-auto my-0 flex w-full flex-col items-center">
      <div class="mb-5 grid grid-cols-2 gap-5">
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

      <h3 class="my-2.5 text-center text-lg font-bold">Guess Distribution</h3>

      <GuessDistribution guessDistribution={props.stats.guessDistribution} />
    </div>
  );
}

export default StatsContainer;
