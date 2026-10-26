interface ButtonProps {
  label: string;
  onClick(): void;
}

function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      class="rounded-5 bg-btn px-fluid hover:bg-btn-hover m-2.5 inline-block cursor-pointer touch-manipulation border-0 py-2.5 text-base whitespace-nowrap text-white"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

export default Button;
