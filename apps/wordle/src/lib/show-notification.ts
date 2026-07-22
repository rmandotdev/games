import { createSignal } from "solid-js";

const [getNotificationMessage, setNotificationMessage] =
  createSignal<string>("");

export function showNotification(message: string) {
  setNotificationMessage(message);
}

export { getNotificationMessage };
