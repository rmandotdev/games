import { For } from "solid-js";
import type { Stats } from "#types";

function GuessDistributionRow(props: { v: number; i: number; p: number }) {
  return (
    <div class="flex w-9/10 items-center">
      <div class="mr-2.5 w-5 text-right font-bold text-base">{props.i + 1}</div>
      <div class="relative h-7.5 grow rounded-sm bg-absent">
        <div
          class="h-full rounded-sm bg-correct"
          style={{
            width: `${props.p}%`,
          }}
        />
        <div class="absolute top-1/2 right-[5px] -translate-y-1/2 font-bold text-base text-dark">
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
    <div class="rounded-[5px] border-2 border-border-light border-solid bg-content-bg p-2.5 text-center dark:border-border-dark dark:bg-content-bg-dark">
      <div class="mb-[5px] font-bold text-2xl" id={props.id}>
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
    <div class="mx-auto my-0 flex w-full max-w-container flex-col items-center">
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

      <h3 class="my-2.5 text-center font-bold text-lg">Guess Distribution</h3>

      <GuessDistribution guessDistribution={props.stats.guessDistribution} />
    </div>
  );
}

export default StatsContainer;
