import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

interface SectionProps {
  children: ComponentProps<"div">["children"];
}

function Section(props: SectionProps) {
  const [local] = splitProps(props, ["children"]);

  return (
    <div class="rounded-section p-section shadow-8-32-10 w-9/10 max-w-220 border border-white/10 bg-white/10 text-center backdrop-blur-md">
      {local.children}
    </div>
  );
}

export default Section;
