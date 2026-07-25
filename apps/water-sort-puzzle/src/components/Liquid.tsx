import CONFIG from "#config";
import type { Color } from "#types";

function Liquid(props: { color: Color }) {
  return (
    <div
      class="liquid h-1/4 w-full"
      style={{ "background-color": CONFIG.colors[props.color] }}
    />
  );
}

export default Liquid;
