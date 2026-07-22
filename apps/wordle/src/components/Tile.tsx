import type { TileInfo } from "#types";

function Tile(props: { tile: TileInfo }) {
  return (
    <div
      class="size-15 border-2 border-solid flex justify-center items-center text-[2em] font-bold uppercase transition duration-300 ease-[ease]"
      classList={{
        "border-border-light dark:border-border-dark":
          props.tile.color !== "correct" &&
          props.tile.color !== "present" &&
          props.tile.color !== "absent",
        correct: props.tile.color === "correct",
        present: props.tile.color === "present",
        absent: props.tile.color === "absent",
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
