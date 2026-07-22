import { For } from "solid-js";

import { CONFIG } from "#config";

import type {
  BoardAction,
  KeyColor,
  KeyColorOrNotColored,
  KeyName,
  Settings,
} from "#types";

function KeyboardButton(props: {
  name: KeyName;
  label?: string;
  width?: number;
  height?: number;
  color?: KeyColorOrNotColored;
  onClick: () => void;
}) {
  const width: number = props.width ?? 1;
  const height: number = props.height ?? 1;

  const label: string = props.label ?? props.name;

  const color: KeyColorOrNotColored = props.color ?? "";

  return (
    <button
      type="button"
      class="text-white border-0 text-2xl font-bold cursor-pointer p-0"
      classList={{
        "bg-content-bg hover:bg-content-hover": !color,
        "bg-correct": color === "correct",
        "bg-present": color === "present",
        "bg-absent": color === "absent",
      }}
      onClick={props.onClick}
      style={{
        "grid-column": `span ${width}`,
        "grid-row": `span ${height}`,
        "font-size":
          props.name === "Enter" ? "var(--enter-key-font-size)" : undefined,
      }}
    >
      {label}
    </button>
  );
}

function getKeysArray(
  settings: Settings,
  handleBoardAction: (action: BoardAction) => void,
  keycolors: Record<string, KeyColor>,
) {
  const elements = [];

  const keyboardLayout = CONFIG.keyboardLayouts[settings.keyboardLayout];

  for (const key of keyboardLayout[0] + keyboardLayout[1]) {
    elements.push(
      <KeyboardButton
        name={key}
        color={keycolors[key] ?? ""}
        onClick={() => handleBoardAction({ type: "INPUT-LETTER", data: key })}
      />,
    );
  }

  if (settings.keyboardLayout === "QWERTY") {
    elements.push(
      <KeyboardButton
        name={"Enter"}
        label="↵"
        width={1}
        height={2}
        onClick={() => handleBoardAction({ type: "SUBMIT-GUESS" })}
      />,
    );
  } else if (settings.keyboardLayout === "AZERTY") {
    elements.push(
      <KeyboardButton
        name={"Enter"}
        label="↵"
        width={2}
        height={1}
        onClick={() => handleBoardAction({ type: "SUBMIT-GUESS" })}
      />,
    );
  }

  for (const key of keyboardLayout[2]) {
    elements.push(
      <KeyboardButton
        name={key}
        color={keycolors[key] ?? ""}
        onClick={() => handleBoardAction({ type: "INPUT-LETTER", data: key })}
      />,
    );
  }

  elements.push(
    <KeyboardButton
      name={"Delete"}
      label="⌫"
      width={2}
      height={1}
      onClick={() => handleBoardAction({ type: "DELETE-LETTER" })}
    />,
  );

  if (settings.submitButtonType === "SUBMIT") {
    elements.push(
      <KeyboardButton
        name={"Submit"}
        label="SUBMIT"
        width={10}
        height={1}
        onClick={() => handleBoardAction({ type: "SUBMIT-GUESS" })}
      />,
    );
  }

  return elements;
}

function Keyboard(props: {
  settings: Settings;
  keycolors: Record<string, KeyColor>;
  handleBoardAction: (action: BoardAction) => void;
}) {
  const keysArray = () =>
    getKeysArray(props.settings, props.handleBoardAction, props.keycolors);

  return (
    <div
      class="grid gap-keyboard"
      style={{ "grid-template-columns": "repeat(10, var(--key-size))" }}
    >
      <For each={keysArray()}>{(key) => key}</For>
    </div>
  );
}

export default Keyboard;
