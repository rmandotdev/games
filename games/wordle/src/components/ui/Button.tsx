import type { Component, JSX } from "solid-js";

interface ButtonProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "textContent"> {
  label: string;
}

const Button: Component<ButtonProps> = (props) => {
  const { label, ...rest } = props;
  return (
    <button
      {...rest}
      class="mt-5 py-2.5 px-5 text-lg leading-none text-(--text-color-light) dark:text-(--text-color-dark) border-2 border-solid border-(--border-color-light) dark:border-(--border-color-dark) cursor-pointer font-bold uppercase bg-(--content-bg-light) dark:bg-(--content-bg-dark) hover:bg-(--content-hover-bg-light) dark:hover:bg-(--content-hover-bg-dark) transition-colors duration-300"
      textContent={label}
    />
  );
};

export default Button;
