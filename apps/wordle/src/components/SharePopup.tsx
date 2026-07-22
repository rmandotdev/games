import { showNotification } from "#lib/show-notification";

import Button from "./ui/Button";

export type SharePopupData = {
  isWin: boolean;
  title: string;
  pattern: string;
  shareText: string;
};

function SharePopup(props: { data: SharePopupData; onClose: () => void }) {
  const copyTextToClipboard = (text: string) =>
    navigator.clipboard
      .writeText(text)
      .then(() => showNotification("Copied to clipboard!"))
      .catch(() => showNotification("Failed to copy to clipboard"));

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" onClick={props.onClose} />
      <div
        class="relative bg-black/95 text-white text-[1.2em] py-5 px-10 rounded-[10px] text-center w-fit z-10"
        style={{ "box-shadow": "0 4px 12px rgba(0, 0, 0, 0.2)" }}
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
          class="my-2.5"
          onClick={() => copyTextToClipboard(props.data.shareText)}
        />
      </div>
    </div>
  );
}

export default SharePopup;
