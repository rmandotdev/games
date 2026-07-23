import type { JSX } from "solid-js";

interface ButtonProps
  extends Pick<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  label: string;
}

function Button(props: ButtonProps) {
  return (
    <button
      type={props.type}
      class="cursor-pointer whitespace-nowrap rounded-5 border-none bg-primary px-5 py-2.5 text-base text-white transition-colors duration-300 ease-[ease] hover:bg-secondary"
    >
      {props.label}
    </button>
  );
}

export default Button;
