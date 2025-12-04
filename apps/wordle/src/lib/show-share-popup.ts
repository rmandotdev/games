import { getGuessPattern } from "./get-guess-patern";

import SharePopup from "~/components/SharePopup";

export function showSharePopup({
  isWin,
  guesses,
  secretWord,
}: {
  isWin: boolean;
  guesses: string[];
  secretWord: string;
}) {
  const title = isWin
    ? "Congratulations!"
    : `Game Over! The word was ${secretWord.toUpperCase()}`;

  const pattern = getGuessPattern(guesses, secretWord);

  const attempts = guesses.length;
  const topText = isWin
    ? `I guessed a word in Wordle in ${attempts} attempts`
    : `I did not guess a word in Wordle`;
  const shareText = `${topText}\n\n${pattern}\n\nPlay on ${window.location.href}`;

  const popup = SharePopup({ isWin, title, pattern, shareText });
  document.body.appendChild(popup);

  window.setTimeout(() => {
    popup.classList.add("show");
  }, 100);
}
