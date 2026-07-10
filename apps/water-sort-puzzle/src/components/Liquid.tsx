import CONFIG from "~/config";
import type { Color } from "~/types";

function Liquid(props: { color: Color }) {
  return (
    <div
      class="liquid"
      style={{ "background-color": CONFIG.colors[props.color] }}
    />
  );
}

export default Liquid;
