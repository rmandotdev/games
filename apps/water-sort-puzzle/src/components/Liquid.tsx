import CONFIG from "~/config";
import type { Color } from "~/types";

const Liquid = (props: { color: Color }) => (
  <div
    class="liquid"
    style={{ "background-color": CONFIG.colors[props.color] }}
  />
);

export default Liquid;
