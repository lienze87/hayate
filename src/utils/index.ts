export function randomHex() {
  // 0xffffff=16777215
  return Math.floor(Math.random() * 16777215).toString(16);
}
