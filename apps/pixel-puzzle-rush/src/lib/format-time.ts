export function formatTime(time: number): string {
  return `${(time / 1000).toFixed(2)}s`;
}
