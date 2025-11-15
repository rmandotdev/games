import { getGuessPattern } from "~/lib/get-guess-patern";

import { describe, it, expect } from "bun:test";

describe("getGuessPatern", () => {
  it("should return the correct pattern", () => {
    const guesses = ["MEDAL", "FIGHT", "THEIR"] as const;
    const secret = "THEIR";
    const expectedPattern = "⬛🟨⬛⬛⬛\n⬛🟨⬛🟨🟨\n🟩🟩🟩🟩🟩";
    expect(getGuessPattern(guesses, secret)).toEqual(expectedPattern);
  });

  it("should return the correct pattern for different casing", () => {
    const guesses = ["MEDAL", "FIGHT", "THEIR"] as const;
    const secret = "THEIR";
    const expectedPattern = "⬛🟨⬛⬛⬛\n⬛🟨⬛🟨🟨\n🟩🟩🟩🟩🟩";
    expect(getGuessPattern(guesses, secret.toLowerCase())).toEqual(
      expectedPattern
    );
  });
});
