import type { JSX } from "solid-js";

interface ButtonProps
  extends Pick<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  label: string;
}

function Button(props: ButtonProps) {
  return (
    <button
      type={props.type}
      class="py-2.5 px-5 text-white bg-primary hover:bg-secondary border-none rounded-5 cursor-pointer text-base whitespace-nowrap transition-colors duration-300 ease-[ease]"
    >
      {props.label}
    </button>
  );
}

export default Button;
