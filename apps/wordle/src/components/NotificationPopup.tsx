import { onMount } from "solid-js";

function NotificationPopup(props: { message: string }) {
  let ref!: HTMLDivElement;

  onMount(() => {
    setTimeout(() => ref.classList.add("show"), 0);
  });

  return (
    <div
      ref={ref}
      class="notification fixed top-1/10 left-1/2 bg-black/80 dark:bg-white/80 text-white dark:text-black py-2.5 px-5 rounded-[5px] text-[1.2em] w-fit"
    >
      {props.message}
    </div>
  );
}

export default NotificationPopup;
