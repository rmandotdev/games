function Button(props: { label: string; onClick(): void }) {
  return (
    <button
      type="button"
      class="cursor-pointer text-white rounded-lg relative overflow-hidden font-poppins-sans bg-transparent"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

export default Button;
