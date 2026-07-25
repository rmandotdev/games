import type { JSX } from "astro/jsx-runtime";

interface ControlButtonProps {
  onClick(): void;
  disabled: boolean;
  label: string;
  icon: JSX.Element;
}

function ControlButton(props: ControlButtonProps) {
  return (
    <button
      type="button"
      class="control-button cursor-pointer touch-manipulation border-none bg-none disabled:cursor-not-allowed disabled:opacity-50"
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        width="24px"
        viewBox="0 -960 960 960"
        fill="currrentColor"
        aria-hidden="true"
      >
        {props.icon}
      </svg>
    </button>
  );
}

export default ControlButton;
