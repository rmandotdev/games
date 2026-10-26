interface ButtonProps {
  label: string;
  onClick(): void;
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      class="bg-btn font-arial-sans text-light m-2.5 flex cursor-pointer items-center justify-center rounded-[5px] border-0 px-5 py-2.5 text-lg"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
}

export default Button;
