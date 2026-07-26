import { onMount } from "solid-js";

import { showNotification } from "#lib/show-notification";

import Button from "./ui/Button";

export type SharePopupData = {
  isWin: boolean;
  title: string;
  pattern: string;
  shareText: string;
};

function SharePopup(props: { data: SharePopupData; onClose: () => void }) {
  let ref!: HTMLDivElement;

  onMount(() => {
    setTimeout(() => ref.classList.add("show"), 0);
  });

  const copyTextToClipboard = (text: string) =>
    navigator.clipboard
      .writeText(text)
      .then(() => showNotification("Copied to clipboard!"))
      .catch(() => showNotification("Failed to copy to clipboard"));

  return (
    <div
      ref={ref}
      class="share-popup-game-over absolute top-1/2 left-1/2 z-10 w-fit rounded-[10px] bg-black/95 px-10 py-5 text-center text-[1.2em] text-white"
    >
      <button
        type="button"
        textContent="×"
        class="absolute top-1.25 right-1.25 cursor-pointer border-none bg-transparent p-1.25 text-2xl text-inherit leading-[0.8] opacity-70 transition-opacity duration-200 hover:opacity-100"
        onClick={props.onClose}
      />
      <div textContent={props.data.title} class="mb-3.75 text-2xl" />
      <pre textContent={props.data.pattern} class="mx-0 my-3.75 text-base" />
      <Button
        label="Share"
        onClick={() => copyTextToClipboard(props.data.shareText)}
      />
    </div>
  );
}

export default SharePopup;
