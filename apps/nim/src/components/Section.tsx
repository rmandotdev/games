import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

interface SectionProps {
  children: ComponentProps<"div">["children"];
}

function Section(props: SectionProps) {
  const [local] = splitProps(props, ["children"]);

  return (
    <div class="w-9/10 max-w-200 rounded-section border border-white/10 bg-white/10 p-section text-center shadow-8-32-10 backdrop-blur-md">
      {local.children}
    </div>
  );
}

export default Section;
