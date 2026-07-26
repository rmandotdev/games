interface ButtonProps {
  label: string;
  onClick(): void;
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      class="m-2.5 flex cursor-pointer items-center justify-center rounded-[5px] border-0 bg-btn px-5 py-2.5 font-arial-sans text-lg text-light"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
}

export default Button;
