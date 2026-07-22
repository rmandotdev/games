import { createSignal } from "solid-js";

const [getNotificationMessage, setNotificationMessage] =
  createSignal<string>("");

let timeoutId: number | null = null;

export function showNotification(message: string) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  setNotificationMessage(message);

  timeoutId = window.setTimeout(() => {
    setNotificationMessage("");
    timeoutId = null;
  }, 2000);
}

export { getNotificationMessage };
