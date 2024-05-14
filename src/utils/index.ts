export function randomHex() {
  // 0xffffff=16777215
  return Math.floor(Math.random() * 16777215).toString(16);
}

// 获取文件拓展名
export function getFileExtension(filename: string) {
  return filename.split(".").pop();
}
