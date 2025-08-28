import type { Color } from "../_types";

import CONFIG from "../_config";

const Liquid = (props: { color: Color }) => (
  <div
    class="liquid"
    style={{ "background-color": CONFIG.colors[props.color] }}
  />
);

export default Liquid;
