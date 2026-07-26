function NotificationPopup(props: { message: string }) {
  return (
    <div class="notification fixed top-1/10 left-1/2 w-fit rounded-[5px] bg-black/80 px-5 py-2.5 text-[1.2em] text-white dark:bg-white/80 dark:text-black">
      {props.message}
    </div>
  );
}

export default NotificationPopup;
