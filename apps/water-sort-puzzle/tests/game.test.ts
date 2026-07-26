import { describe, expect, it } from "bun:test";
import { canPour, checkWin, pour } from "#lib/game";
import type { TubeType } from "#types";

describe("canPour", () => {
  it("should return false when from and to are the same", () => {
    const tubes: TubeType[] = [
      [0, 1],
      [2, 3],
    ];
    expect(canPour(tubes, 0, 0)).toBe(false);
  });

  it("should return false when source tube is empty", () => {
    const tubes: TubeType[] = [[], [0, 1]];
    expect(canPour(tubes, 0, 1)).toBe(false);
  });

  it("should return false when destination tube is full", () => {
    const tubes: TubeType[] = [[0], [1, 2, 3, 4]];
    expect(canPour(tubes, 0, 1)).toBe(false);
  });

  it("should return true when destination tube is empty", () => {
    const tubes: TubeType[] = [[0, 1], []];
    expect(canPour(tubes, 0, 1)).toBe(true);
  });

  it("should return true when top colors match", () => {
    const tubes: TubeType[] = [
      [0, 1, 2],
      [3, 4, 2],
    ];
    expect(canPour(tubes, 0, 1)).toBe(true);
  });

  it("should return false when top colors do not match", () => {
    const tubes: TubeType[] = [
      [0, 1, 2],
      [3, 4, 1],
    ];
    expect(canPour(tubes, 0, 1)).toBe(false);
  });
});

describe("pour", () => {
  it("should pour single liquid to empty tube", () => {
    const tubes: TubeType[] = [[0, 1], []];
    pour(tubes, 0, 1);
    expect(tubes[0]).toEqual([0]);
    expect(tubes[1]).toEqual([1]);
  });

  it("should pour consecutive same-color layers", () => {
    const tubes: TubeType[] = [[0, 1, 1, 1], []];
    pour(tubes, 0, 1);
    expect(tubes[0]).toEqual([0]);
    expect(tubes[1]).toEqual([1, 1, 1]);
  });

  it("should pour only matching top color layers", () => {
    const tubes: TubeType[] = [[0, 1, 1, 2], []];
    pour(tubes, 0, 1);
    expect(tubes[0]).toEqual([0, 1, 1]);
    expect(tubes[1]).toEqual([2]);
  });

  it("should not exceed destination tube capacity", () => {
    const tubes: TubeType[] = [
      [0, 1, 1, 1, 1],
      [2, 2],
    ];
    pour(tubes, 0, 1);
    expect(tubes[0]).toEqual([0, 1, 1]);
    expect(tubes[1]).toEqual([2, 2, 1, 1]);
  });
});

describe("checkWin", () => {
  it("should return true for all empty tubes", () => {
    const tubes: TubeType[] = [[], [], []];
    expect(checkWin(tubes)).toBe(true);
  });

  it("should return true when each tube is single-colored or empty", () => {
    const tubes: TubeType[] = [[0, 0, 0, 0], [1, 1, 1, 1], []];
    expect(checkWin(tubes)).toBe(true);
  });

  it("should return false when tubes have mixed colors", () => {
    const tubes: TubeType[] = [[0, 1, 0, 0], [1, 1, 1, 1], []];
    expect(checkWin(tubes)).toBe(false);
  });

  it("should return false when a tube is partially filled with mixed colors", () => {
    const tubes: TubeType[] = [[0, 0], [1, 0, 1, 1], []];
    expect(checkWin(tubes)).toBe(false);
  });

  it("should return true when only empty tubes remain", () => {
    const tubes: TubeType[] = [[], []];
    expect(checkWin(tubes)).toBe(true);
  });
});
