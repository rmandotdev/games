import { For } from "solid-js";
import type { Stats } from "~/types";

const GuessDistributionRow = (props: { v: number; i: number; p: number }) => (
  <div class="flex items-center w-9/10">
    <div class="w-5 text-right mr-2.5 font-bold text-base">{props.i + 1}</div>
    <div class="guess-bar">
      <div class="guess-bar-fill" style={{ width: `${props.p}%` }} />
      <div class="absolute right-[5px] top-1/2 font-bold text-base text-(--text-color-light) dark:text-(--text-color-dark) -translate-y-1/2">
        {props.v}
      </div>
    </div>
  </div>
);

const GuessDistribution = (props: { guessDistribution: number[] }) => (
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

const StatBox = (props: {
  id?: string;
  value: string | number;
  label: string;
}) => (
  <div class="bg-(--content-bg-light) dark:bg-(--background-color-dark) border-(--border-color-light) dark:border-(--text-color-dark) border-2 border-solid rounded-[5px] p-2.5 text-center">
    <div class="text-2xl font-bold mb-[5px]" id={props.id}>
      {props.value}
    </div>
    <div class="text-base">{props.label}</div>
  </div>
);

const getNormalizedPercentage = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 100);

const StatsContainer = (props: { stats: Stats }) => (
  <div class="content-container">
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

export default StatsContainer;
