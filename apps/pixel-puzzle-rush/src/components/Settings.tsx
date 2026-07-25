interface SettingsProps {
  gridSizeInput: string;
  setGridSizeInput(value: string): void;
  colorCountInput: string;
  setColorCountInput(value: string): void;
}

function Settings(props: SettingsProps) {
  return (
    <div id="settings" class="mb-5 flex select-none justify-center">
      <select
        aria-label="Grid size"
        value={props.gridSizeInput}
        onChange={(e) => props.setGridSizeInput(e.target.value)}
      >
        <option value="2">2x2</option>
        <option value="3">3x3</option>
        <option value="4" selected>
          4x4
        </option>
        <option value="5">5x5</option>
        <option value="6">6x6</option>
        <option value="7">7x7</option>
        <option value="8">8x8</option>
        <option value="9">9x9</option>
        <option value="10">10x10</option>
      </select>

      <select
        aria-label="Color count"
        value={props.colorCountInput}
        onChange={(e) => props.setColorCountInput(e.target.value)}
      >
        <option value="2">2 colors</option>
        <option value="3">3 colors</option>
        <option value="4" selected>
          4 colors
        </option>
        <option value="5">5 colors</option>
        <option value="6">6 colors</option>
        <option value="7">7 colors</option>
      </select>
    </div>
  );
}

export default Settings;
