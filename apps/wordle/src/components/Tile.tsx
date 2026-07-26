import type { TileInfo } from "#types";

function Tile(props: { tile: TileInfo }) {
  return (
    <div
      class="flex size-15 items-center justify-center border-2 border-solid font-bold text-[2em] uppercase transition duration-300 ease-[ease]"
      classList={{
        "border-border-light dark:border-border-dark":
          props.tile.color !== "correct" &&
          props.tile.color !== "present" &&
          props.tile.color !== "absent",
        "bg-correct": props.tile.color === "correct",
        "bg-present": props.tile.color === "present",
        "bg-absent": props.tile.color === "absent",
        "animate-flip": props.tile.anim === "flip",
        "animate-shake": props.tile.anim === "shake",
        "animate-pop": props.tile.anim === "pop",
      }}
    >
      {props.tile.letter}
    </div>
  );
}

export default Tile;
