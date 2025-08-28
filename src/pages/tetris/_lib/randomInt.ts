type MaxDepth = 999;

type IsGeneralNumber<N> = number extends N
  ? N extends number
    ? true
    : false
  : false;

type BuildTuple<
  L extends number,
  T extends unknown[] = []
> = IsGeneralNumber<L> extends true
  ? number[]
  : T["length"] extends L
  ? T
  : T["length"] extends MaxDepth
  ? number[]
  : BuildTuple<L, [...T, T["length"]]>;

type XRange<N extends number> = BuildTuple<N> extends (infer R)[] ? R : never;

export function randomInt<const N extends number>(max: N): XRange<N> {
  return Math.floor(Math.random() * max) as XRange<N>;
}
