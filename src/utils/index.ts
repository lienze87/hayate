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
    const reg = /^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/;
    if (!reg.test(param)) {
      throw new Error('格式错误');
    }
    let hours = parseInt(param.split(':')[0]) * 60 * 60;
    let minutes = parseInt(param.split(':')[1]) * 60;
    let seconds = parseInt(param.split(':')[2]);

    return hours + minutes + seconds;
  }

  if (typeof param === 'number') {
    let hours = Math.floor(param / (60 * 60));
    let minutes = Math.floor((param % 3600) / 60);
    let seconds = Math.floor(param % 60);

    return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
  }
}
