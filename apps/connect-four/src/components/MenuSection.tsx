function MenuSection(props: { startNewGame: () => void }) {
  return (
    <div class="justify-items-center text-center items-center">
      <button
        class="whitespace-nowrap inline-block text-white border-0 rounded-[5px] cursor-pointer text-base bg-btn hover:bg-btn-hover"
        style={{ margin: "10px", padding: "10px min(20px, 10%)" }}
        onClick={props.startNewGame}
      >
        NEW GAME
      </button>
    </div>
  );
}

export default MenuSection;
