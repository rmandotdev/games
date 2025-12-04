import type { TileInfo } from "~/types";

const Tile = (props: { tile: TileInfo }) => (
  <div class={`tile ${props.tile.color} ${props.tile.anim}`}>
    {props.tile.letter}
  </div>
);

export default Tile;
