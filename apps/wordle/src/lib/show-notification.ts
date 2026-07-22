import { createSignal } from "solid-js";

const [getNotificationMessage, setNotificationMessage] =
  createSignal<string>("");

let timeoutId: number | null = null;

export function showNotification(message: string) {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  setNotificationMessage("");

  setTimeout(() => {
    setNotificationMessage(message);

    timeoutId = window.setTimeout(() => {
      setNotificationMessage("");
      timeoutId = null;
    }, 2000);
  }, 0);
}

export { getNotificationMessage };
