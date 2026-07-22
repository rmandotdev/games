import { createEffect } from "solid-js";

import { getNotificationMessage } from "#lib/show-notification";

function NotificationPopup() {
  let ref!: HTMLDivElement;

  createEffect(() => {
    const msg = getNotificationMessage();
    if (msg) {
      ref.style.animation = "none";
      void ref.offsetHeight;
      ref.style.animation = "";
    }
  });

  return (
    <div
      ref={ref}
      class="notification fixed top-1/10 left-1/2 bg-black/80 dark:bg-white/80 text-white dark:text-black py-2.5 px-5 rounded-[5px] text-[1.2em] w-fit"
    >
      {getNotificationMessage()}
    </div>
  );
}

export default NotificationPopup;
