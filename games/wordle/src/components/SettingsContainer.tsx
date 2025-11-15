import type { Settings } from "~/types";

const SettingGroup = <T extends string>(props: {
  id: string;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) => (
  <div class="flex justify-between items-end w-full mb-4">
    <label for={props.id} class="font-bold text-2xl">
      {props.label}
    </label>

    <select
      id={props.id}
      class="setting-select"
      value={props.value}
      onChange={(event) => props.onChange(event.target.value as T)}
    >
      {props.options.map((opt) => (
        <option value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const SettingsContainer = (props: {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}) => (
  <div class="content-container">
    <SettingGroup
      id="theme-select"
      label="Theme"
      value={props.settings.theme}
      options={[
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
      ]}
      onChange={(theme) => props.updateSettings({ theme })}
    />

    <SettingGroup
      id="keyboard-layout-select"
      label="Keyboard Type"
      value={props.settings.keyboardLayout}
      options={[
        { value: "QWERTY", label: "QWERTY" },
        { value: "AZERTY", label: "AZERTY" },
      ]}
      onChange={(keyboardLayout) => props.updateSettings({ keyboardLayout })}
    />

    <SettingGroup
      id="submit-button-type-select"
      label="Submit Button Type"
      value={props.settings.submitButtonType}
      options={[
        { value: "ENTER", label: "ENTER" },
        { value: "SUBMIT", label: "SUBMIT" },
      ]}
      onChange={(submitButtonType) =>
        props.updateSettings({ submitButtonType })
      }
    />
  </div>
);

export default SettingsContainer;
