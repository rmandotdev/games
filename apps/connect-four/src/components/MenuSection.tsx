import Button from "./ui/Button";

function MenuSection(props: { startNewGame(): void }) {
  return (
    <div class="justify-items-center text-center items-center">
      <Button onClick={props.startNewGame} label="NEW GAME" />
    </div>
  );
}

export default MenuSection;
