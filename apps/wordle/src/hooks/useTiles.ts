import { createSignal } from "solid-js";
import { CONFIG } from "~/config";
import type { TileColor, TileInfo } from "~/types";

function getArrayFullOf<T, Length extends number = number>(
  item: T,
  { length }: { length: Length },
): T[] {
  return Array.from({ length }, () => window.structuredClone(item));
}

function getEmptyTiles(): TileInfo[] {
  const tiles = getArrayFullOf<TileInfo>(
    { letter: "", color: "", anim: "" },
    { length: CONFIG.maxGuesses * CONFIG.wordLength },
  );

  return tiles;
}

export function useTiles() {
  const [getTiles, setTiles] = createSignal<TileInfo[]>(getEmptyTiles());

  const [getCurrentRow, setCurrentRow] = createSignal<number>(0);
  const [getCurrentTile, setCurrentTile] = createSignal<number>(0);

  const resetTiles = () => setTiles(getEmptyTiles());

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const FLIP_DELAY = 250;

  async function flipTile(
    tileIndex: number,
    color: TileColor,
  ): Promise<TileColor> {
    setTiles((prev) => {
      const copy = [...prev];
      copy[tileIndex] = { ...copy[tileIndex]!, anim: "flip" };
      return copy;
    });

    await delay(FLIP_DELAY);

    setTiles((prev) => {
      const copy = [...prev];
      copy[tileIndex] = { ...copy[tileIndex]!, color, anim: "" };
      return copy;
    });

    return color;
  }

  function popTile(tileIndex: number, letter: string) {
    setTiles((prev) => {
      const copy = [...prev];
      copy[tileIndex] = { ...copy[tileIndex]!, letter, anim: "pop" };
      return copy;
    });

    window.setTimeout(() => {
      setTiles((prev) => {
        const copy = [...prev];
        copy[tileIndex] = { ...copy[tileIndex]!, anim: "" };
        return copy;
      });
    }, 150);
  }

  function shakeCurrentRow() {
    const row = getCurrentRow();
    const start = row * CONFIG.wordLength;
    const end = start + CONFIG.wordLength;

    setTiles((prev) => {
      const copy = [...prev];
      for (let i = start; i < end; i++) {
        copy[i] = { ...copy[i]!, anim: "shake" };
      }
      return copy;
    });

    window.setTimeout(() => {
      setTiles((prev) => {
        const copy = [...prev];
        for (let i = start; i < end; i++) {
          copy[i] = { ...copy[i]!, anim: "" };
        }
        return copy;
      });
    }, 500);
  }

  return {
    getTiles,
    setTiles,
    shakeCurrentRow,
    resetTiles,
    flipTile,
    popTile,
    getCurrentRow,
    setCurrentRow,
    getCurrentTile,
    setCurrentTile,
  };
}
