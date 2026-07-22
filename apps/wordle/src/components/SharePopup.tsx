import { showNotification } from "#lib/show-notification";

import Button from "./ui/Button";

const copyTextToClipboard = (text: string) =>
  navigator.clipboard
    .writeText(text)
    .then(() => showNotification("Copied to clipboard!"))
    .catch(() => showNotification("Failed to copy to clipboard"));

function SharePopup(props: {
  isWin: boolean;
  title: string;
  pattern: string;
  shareText: string;
}) {
  const popup = (
    <div
      class="left-1/2 top-1/2 text-white text-[1.2em] opacity-0 absolute bg-black/95 py-5 px-10 rounded-[10px] text-center w-fit"
      style={{
        transform: "translate(-50%, -50%) scale(0.8)",
        "box-shadow": "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <button
        textContent="×"
        class="absolute top-[5px] right-[5px] bg-transparent border-none text-inherit text-2xl cursor-pointer p-[5px] leading-[0.8] opacity-70 transition-opacity duration-200 hover:opacity-100"
        onClick={() => {
          popup.classList.remove("show");
          window.setTimeout(() => popup.remove(), 300);
        }}
      />
      <div textContent={props.title} class="text-2xl mb-[15px]" />
      <pre textContent={props.pattern} class="my-[15px] mx-0 text-base" />
      <Button
        label="Share"
        style={{ margin: "10px 0" }}
        onClick={() => copyTextToClipboard(props.shareText)}
      />
    </div>
  ) as HTMLDivElement;

  return popup;
}

export default SharePopup;
