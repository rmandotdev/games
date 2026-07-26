function Button(props: { label: string; onClick(): void }) {
  return (
    <button
      type="button"
      class="relative m-3 cursor-pointer overflow-hidden rounded-lg border-2 border-white/20 border-solid bg-transparent px-6 py-3 font-poppins-sans text-lg text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-5-15-20 active:translate-y-0"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

export default Button;
