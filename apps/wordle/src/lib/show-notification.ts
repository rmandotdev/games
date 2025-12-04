import NotificationPopup from "~/components/NotificationPopup";

const notificationTimeout: { id: number | null } = { id: null };

export function showNotification(message: string) {
  if (notificationTimeout.id) {
    window.clearTimeout(notificationTimeout.id);
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }
  }

  const notification = NotificationPopup({ message }) as HTMLDivElement;
  document.body.appendChild(notification);

  window.setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  notificationTimeout.id = window.setTimeout(() => {
    notification.classList.remove("show");
    window.setTimeout(() => {
      notification.remove();
      notificationTimeout.id = null;
    }, 300);
  }, 2000);
}
