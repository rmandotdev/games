import type { TileInfo } from "#types";

function Tile(props: { tile: TileInfo }) {
  return (
    <div
      class={`size-15 border-2 border-solid flex justify-center items-center text-[2em] font-bold uppercase transition duration-300 ease-[ease] ${
        props.tile.color === "correct" ||
        props.tile.color === "present" ||
        props.tile.color === "absent"
          ? props.tile.color
          : "border-(--border-color-light)"
      } ${props.tile.anim ? `animate-${props.tile.anim}` : ""}`}
    >
      {props.tile.letter}
    </div>
  );
}

export default Tile;
