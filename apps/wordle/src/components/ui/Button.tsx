import type { JSX } from "solid-js";

interface ButtonProps
  extends Omit<
    JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    "textContent" | "class"
  > {
  label: string;
}

function Button(props: ButtonProps) {
  const { label, ...rest } = props;
  return (
    <button
      {...rest}
      type="button"
      class="mt-5 cursor-pointer touch-manipulation border-2 border-border-light border-solid bg-content-bg px-5 py-2.5 font-bold text-dark text-lg uppercase leading-none transition-colors duration-300 hover:bg-content-hover dark:border-border-dark dark:bg-content-bg-dark dark:text-light dark:hover:bg-content-hover-dark"
      textContent={label}
    />
  );
}

export default Button;
