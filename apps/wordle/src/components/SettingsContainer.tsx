import type { Settings } from "#types";

function SettingGroup<T extends string>(props: {
  id: string;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div class="flex justify-between items-end w-full mb-4">
      <label for={props.id} class="font-bold text-2xl">
        {props.label}
      </label>

      <select
        id={props.id}
        class="w-32 p-2 text-base border border-solid rounded-[5px] text-dark dark:text-light border-border-light dark:border-border-dark bg-white"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value as T)}
      >
        {props.options.map((opt) => (
          <option value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function SettingsContainer(props: {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}) {
  return (
    <div
      class="w-full flex flex-col items-center my-0 mx-auto"
      style={{ "max-width": "var(--content-max-width)" }}
    >
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
}

export default SettingsContainer;
