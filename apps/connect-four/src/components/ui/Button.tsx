interface ButtonProps {
  label: string;
  onClick(): void;
}

function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      class="m-2.5 inline-block cursor-pointer touch-manipulation whitespace-nowrap rounded-5 border-0 bg-btn px-fluid py-2.5 text-base text-white hover:bg-btn-hover"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

export default Button;
