function Cell(props: { x: number; y: number; colorIndex: number }) {
  return (
    <div
      class="tetromino border"
      classList={{
        "border-white": props.colorIndex !== 0,
        "border-white/10": props.colorIndex === 0,
      }}
      style={
        props.colorIndex
          ? {
              "--tetromino-color": `var(--color-tetromino-${props.colorIndex})`,
            }
          : undefined
      }
    />
  );
}

export default Cell;
