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
      class="mt-5 py-2.5 px-5 text-lg leading-none text-dark dark:text-light border-2 border-solid border-border-light dark:border-border-dark cursor-pointer font-bold uppercase bg-content-bg dark:bg-content-bg-dark hover:bg-content-hover dark:hover:bg-content-hover-dark transition-colors duration-300"
      textContent={label}
    />
  );
}

export default Button;
