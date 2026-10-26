import type { Settings } from "#types";

function SettingGroup<T extends string>(props: {
  id: string;
  label: string;
  value: T;
  options: { value: NoInfer<T>; label: string }[];
  onChange(value: T): void;
}) {
  return (
    <div class="mb-4 flex w-full items-end justify-between">
      <label for={props.id} class="text-2xl font-bold">
        {props.label}
      </label>

      <select
        id={props.id}
        class="border-border-light text-dark dark:border-border-dark dark:bg-content-bg-dark dark:text-light w-32 rounded-[5px] border border-solid bg-white p-2 text-base"
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
  updateSettings(settings: Partial<Settings>): void;
}) {
  return (
    <div class="max-w-container mx-auto my-0 flex w-full flex-col items-center">
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
