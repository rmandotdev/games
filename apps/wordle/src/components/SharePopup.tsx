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
      class="share-popup-game-over absolute left-1/2 top-1/2 text-white text-[1.2em] opacity-0 bg-black/95 py-5 px-10 rounded-[10px] text-center w-fit z-10"
      style={{
        transform: "translate(-50%, -50%) scale(0.8)",
        transition: "transform 0.3s, opacity 0.3s",
        "box-shadow": "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <button
        type="button"
        textContent="×"
        class="absolute top-1.25 right-1.25 bg-transparent border-none text-inherit text-2xl cursor-pointer p-1.25 leading-[0.8] opacity-70 transition-opacity duration-200 hover:opacity-100"
        onClick={props.onClose}
      />
      <div textContent={props.data.title} class="text-2xl mb-3.75" />
      <pre textContent={props.data.pattern} class="my-3.75 mx-0 text-base" />
      <Button
        label="Share"
        onClick={() => copyTextToClipboard(props.data.shareText)}
      />
    </div>
  );
}

export default SharePopup;
