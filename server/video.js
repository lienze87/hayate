import { exec } from "child_process";
import process from "process";
import fs from "fs";
import util from "util";

const promiseExec = util.promisify(exec);

// 在当前行更新log
function printProgress(string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(string);
}

async function execCommand(command) {
  let count = 0;
  const timer = setInterval(() => {
    count += 100;
    printProgress(`timer: ${count}`);
  }, 100);

  // exec(command, (error, stdout, stderr) => {
  //   if (error) {
  //     throw error;
  //   }
  //   clearTimeout(timer);
  //   process.stdout.write("\n");
  //   console.log("stdout:", stdout);
  //   console.log("stderr:", stderr);
  // });

  const { stdout, stderr } = await promiseExec(command);

  clearTimeout(timer);
  process.stdout.write("\n");

  // console.log("stdout:", stdout);
  // console.log("stderr:", stderr);
  console.log("command finished");
}

// 按时间截取视频
export async function cutVideoByTime(begin, end, inputFileName, outFileName) {
  // 如果结果文件存在，就删除文件
  if (fs.existsSync(outFileName)) {
    fs.unlinkSync(outFileName);
  }

  await execCommand(
    `ffmpeg -i ${inputFileName} -ss ${begin} -to ${end} -async 1 -c copy ${outFileName}`
  );
}

// 按帧截取视频
//  Timebase = 1/75; Timescale = 75
//  Frame        pts           pts_time
//    0          0          0 x 1/75 = 0.00
//    1          3          3 x 1/75 = 0.04
//    2          6          6 x 1/75 = 0.08
//    3          9          9 x 1/75 = 0.12
function cutVideoByFrame(begin, end, inputFileName, outFileName) {
  // 如果结果文件存在，就删除文件
  if (fs.existsSync(outFileName)) {
    fs.unlinkSync(outFileName);
  }

  execCommand(
    `ffmpeg -i ${inputFileName} -vf "trim=start_frame=${begin}:end_frame=${end},setpts=PTS-STARTPTS" -an ${outFileName}`
  );
}

// // 由视频导出指定帧图片
export function exportVideoToImage(fileName) {
  execCommand(
    `ffmpeg -i ${fileName} -vf select="between(t\\,2\\,5)" -vsync 0 ./public/${fileName.split(".mp4")[0]}-image%2d.png`
  );
}
