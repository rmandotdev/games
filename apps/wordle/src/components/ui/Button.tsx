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
      class="border-border-light bg-content-bg text-dark hover:bg-content-hover dark:border-border-dark dark:bg-content-bg-dark dark:text-light dark:hover:bg-content-hover-dark mt-5 cursor-pointer touch-manipulation border-2 border-solid px-5 py-2.5 text-lg leading-none font-bold uppercase transition-colors duration-300"
      textContent={label}
    />
  );
}

export default Button;
