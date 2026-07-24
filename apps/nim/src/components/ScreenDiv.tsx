import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

type ScreenDivProps = {
  children: ComponentProps<"div">["children"];
};

function ScreenDiv(props: ScreenDivProps) {
  const [local] = splitProps(props, ["children"]);

  return (
    <div class="w-11/12 max-w-200 rounded-screen border border-white/10 bg-black/10 p-screen text-center shadow-8-32-10 backdrop-blur-md">
      {local.children}
    </div>
  );
}

export default ScreenDiv;
