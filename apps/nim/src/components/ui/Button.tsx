function Button(props: { label: string; onClick(): void }) {
  return (
    <button
      type="button"
      class="relative cursor-pointer overflow-hidden rounded-lg bg-transparent font-poppins-sans text-white"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

export default Button;
