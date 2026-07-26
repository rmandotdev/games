export type Color = "red" | "green" | "blue" | "yellow";

interface SimonButtonProps {
  variant: Color;
  onRef: (el: HTMLButtonElement) => void;
  onClick: (button: HTMLButtonElement, color: Color) => void;
}

function SimonButton(props: SimonButtonProps) {
  return (
    <button
      type="button"
      aria-label={props.variant}
      class="button-flashing size-30 cursor-pointer touch-manipulation rounded-full border-none opacity-80 shadow-button transition-all duration-300 ease-out hover:scale-105 hover:opacity-100"
      classList={{
        "bg-btn-red": props.variant === "red",
        "bg-btn-green": props.variant === "green",
        "bg-btn-blue": props.variant === "blue",
        "bg-btn-yellow": props.variant === "yellow",
      }}
      ref={props.onRef}
      onClick={(e) => props.onClick(e.currentTarget, props.variant)}
    />
  );
}

export default SimonButton;
