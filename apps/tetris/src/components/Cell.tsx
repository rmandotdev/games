function Cell(props: { x: number; y: number; colorIndex: number }) {
  return (
    <div
      class={`grid-cell ${
        props.colorIndex ? `tetromino tetromino-${props.colorIndex - 1}` : ""
      }`}
      data-x={props.x}
      data-y={props.y}
    />
  );
}

export default Cell;
