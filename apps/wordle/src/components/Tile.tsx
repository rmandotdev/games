import type { TileInfo } from "~/types";

function Tile(props: { tile: TileInfo }) {
  return (
    <div class={`tile ${props.tile.color} ${props.tile.anim}`}>
      {props.tile.letter}
    </div>
  );
}

export default Tile;
