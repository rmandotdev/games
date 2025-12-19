import { createSignal, type Setter, type Signal } from "solid-js";

/**
 * Creates a signal that persists its value to localStorage and initializes
 * itself by reading from localStorage.
 *
 * @param key The key to use in localStorage.
 * @param initialValue The default value if no item is found in localStorage.
 * @returns `[getter, setter]` SolidJS signal accessors.
 */
export function createLocalStorageSignal<T>(
  key: string,
  initialValue: T,
): Signal<T> {
  const readValue = (): T => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        // Parse the saved JSON string
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(`Error reading localStorage key "${key}":`, e);
      // Fallback to the initial value on error
    }
    return initialValue;
  };

  const [value, setValue] = createSignal<T>(readValue());

  const customSetter: Setter<T> = ((...args: Parameters<Setter<T>>) => {
    const finalValue = setValue(...args); // Update the signal first

    // Persist the new value to localStorage
    try {
      localStorage.setItem(key, JSON.stringify(finalValue));
    } catch (e) {
      console.error(`Error writing to localStorage key "${key}":`, e);
    }

    return finalValue;
  }) as Setter<T>;

  return [value, customSetter];
}
