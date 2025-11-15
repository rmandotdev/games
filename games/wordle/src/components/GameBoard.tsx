import { For } from "solid-js";

import type { TileInfo } from "~/types";

import Tile from "./Tile";

const GameBoard = (props: { tiles: TileInfo[] }) => (
  <div class="grid grid-cols-5 gap-[5px] mb-5">
    <For each={props.tiles}>{(tile) => <Tile tile={tile} />}</For>
  </div>
);

export default GameBoard;
