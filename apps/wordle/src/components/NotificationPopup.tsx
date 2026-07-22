function NotificationPopup(props: { message: string }) {
  return (
    <div class="notification fixed top-1/10 left-1/2 bg-black/80 dark:bg-white/80 text-white dark:text-black py-2.5 px-5 rounded-[5px] text-[1.2em] w-fit">
      {props.message}
    </div>
  );
}

export default NotificationPopup;
