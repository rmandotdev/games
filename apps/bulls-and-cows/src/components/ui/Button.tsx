import type { JSX } from "solid-js";

interface ButtonProps
  extends Pick<
    JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "onClick"
  > {
  label: string;
}

function Button(props: ButtonProps) {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      class="rounded-5 bg-primary hover:bg-secondary cursor-pointer border-none px-5 py-2.5 text-base whitespace-nowrap text-white transition-colors duration-300 ease-[ease]"
    >
      {props.label}
    </button>
  );
}

export default Button;
