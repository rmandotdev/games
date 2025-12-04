import { getTileColors } from "~/lib/get-tile-colors";
import type { TileColor } from "~/types";

import { describe, it, expect } from "bun:test";

describe("getTileColors", () => {
  it("should return all green for a perfect match", () => {
    const guess = "REBUS";
    const secret = "REBUS";
    const expectedColors: TileColor[] = [
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ];
    expect(getTileColors(guess, secret)).toEqual(expectedColors);
  });

  it("should color the second duplicate letter as green and the first as absent", () => {
    const guess = "SONGS";
    const secret = "REBUS";
    const expectedColors: TileColor[] = [
      "absent",
      "absent",
      "absent",
      "absent",
      "correct",
    ];
    expect(getTileColors(guess, secret)).toEqual(expectedColors);
  });

  it("should correctly color duplicate letters in the guess with one present in the secret", () => {
    const guess = "APPLE";
    const secret = "GRAPE";
    const expectedColors: TileColor[] = [
      "present",
      "present",
      "absent",
      "absent",
      "correct",
    ];
    expect(getTileColors(guess, secret)).toEqual(expectedColors);
  });

  it("should return all yellow for all present but misplaced letters", () => {
    const guess = "EARTH";
    const secret = "HEART";
    const expectedColors: TileColor[] = [
      "present",
      "present",
      "present",
      "present",
      "present",
    ];
    expect(getTileColors(guess, secret)).toEqual(expectedColors);
  });

  it("should handle different caps correctly", () => {
    const guess = "REBUS";
    const secret = "REBUS";
    const expectedColors: TileColor[] = [
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ];
    expect(getTileColors(guess, secret)).toEqual(expectedColors);
    expect(getTileColors(guess.toLowerCase(), secret)).toEqual(expectedColors);
    expect(getTileColors(guess, secret.toLowerCase())).toEqual(expectedColors);
  });
});
