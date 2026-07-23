interface ButtonProps {
  label: string;
  onClick(): void;
}

function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      class="whitespace-nowrap touch-manipulation inline-block text-white border-0 rounded-5 cursor-pointer text-base bg-btn hover:bg-btn-hover m-2.5 p-fluid"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

export default Button;
