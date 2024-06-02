export function randomHex() {
  // 0xffffff=16777215
  return Math.floor(Math.random() * 16777215).toString(16);
}

// 获取文件拓展名
export function getFileExtension(filename: string) {
  return filename.split('.').pop();
}

// 00:01:12 -> 1*60+12
export function translateTime(param: string | number) {
  if (typeof param === 'string') {
    const reg = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;
    if (!reg.test(param)) {
      throw new Error('格式错误');
    }
    const hours = parseInt(param.split(':')[0], 10) * 60 * 60;
    const minutes = parseInt(param.split(':')[1], 10) * 60;
    const seconds = parseInt(param.split(':')[2], 10);

    return hours + minutes + seconds;
  }

  if (typeof param === 'number') {
    const hours = Math.floor(param / (60 * 60));
    const minutes = Math.floor((param % 3600) / 60);
    const seconds = Math.floor(param % 60);

    return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;
  }
  return '';
}
