function Button(props: { label: string; onClick(): void; danger?: boolean }) {
  return (
    <button
      type="button"
      class="cursor-pointer touch-manipulation border-none px-4 py-2 font-press-start text-base transition-all duration-300"
      classList={{
        "bg-red text-white hover:bg-light-red": !props.danger,
        "bg-cyan text-black hover:bg-white": props.danger,
      }}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

export default Button;
