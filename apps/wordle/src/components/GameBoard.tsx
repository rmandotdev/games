import { For } from "solid-js";

import type { TileInfo } from "#types";

import Tile from "./Tile";

function GameBoard(props: { tiles: TileInfo[] }) {
  return (
    <div class="mb-5 grid grid-cols-5 gap-1.25">
      <For each={props.tiles}>{(tile) => <Tile tile={tile} />}</For>
    </div>
  );
}

export default GameBoard;
