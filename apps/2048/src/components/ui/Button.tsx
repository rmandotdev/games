interface ButtonProps {
  label: string;
  onClick(): void;
  disabled?: boolean;
}

function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      class="text-base font-arial-sans py-2.5 px-5 m-2.5 cursor-pointer bg-btn text-btn-text border-0 rounded-[5px] flex items-center justify-center"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
}

export default Button;
