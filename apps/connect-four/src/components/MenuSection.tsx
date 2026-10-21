import Button from "./ui/Button";

function MenuSection(props: { startNewGame(): void }) {
  return (
    <div class="place-items-center text-center">
      <Button onClick={props.startNewGame} label="NEW GAME" />
    </div>
  );
}

export default MenuSection;
