import { exec } from "child_process";
import process from "process";
import fs from "fs";
import util from "util";
import ffmpeg from "fluent-ffmpeg";

const promiseExec = util.promisify(exec);

// 在当前行更新log
function printProgress(string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(string);
}

function emptyDir(filePath) {
  const files = fs.readdirSync(filePath); //读取该文件夹
  files.forEach((file) => {
    const nextFilePath = `${filePath}/${file}`;
    const states = fs.statSync(nextFilePath);
    if (states.isDirectory()) {
      emptyDir(nextFilePath);
    } else {
      fs.unlinkSync(nextFilePath);
      console.log(`删除文件 ${nextFilePath} 成功`);
    }
  });
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
  return { stdout, stderr };
}

// 按时间截取视频
export async function extractVideoByTime(
  begin,
  end,
  inputFileName,
  outFileName
) {
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
function extractVideoByFrames(begin, end, inputFileName, outFileName) {
  // 如果结果文件存在，就删除文件
  if (fs.existsSync(outFileName)) {
    fs.unlinkSync(outFileName);
  }

  execCommand(
    `ffmpeg -i ${inputFileName} -vf "trim=start_frame=${begin}:end_frame=${end},setpts=PTS-STARTPTS" -an ${outFileName}`
  );
}

// 由视频导出指定范围帧图片
export async function extractImageByFrames(
  begin,
  end,
  inputFileName,
  outFolderName
) {
  // select="between(t\\,2\\,5)" 选择第2-5秒
  // select="between(n\\,2\\,5)" 选择第2-5帧
  // select="eq(n\\,100)+eq(n\\,184)" 导出指定的第100帧和第184帧

  if (fs.existsSync(outFolderName)) {
    emptyDir(outFolderName);
  } else {
    fs.mkdirSync(outFolderName);
  }

  await execCommand(
    `ffmpeg -i ${inputFileName} -vf select="between(n\\,${begin}\\,${end})" -frame_pts 1 -vsync 0 ${outFolderName}/frames%2d.png`
  );
}

async function getVideoInfoByCmd(fileName) {
  if (!fs.existsSync(fileName)) {
    throw Error(`${fileName} not exit`);
  }
  return await execCommand(
    `ffprobe -of json -show_streams -show_format ${fileName}`
  );
}

export function getVideoMetadata(fileName, callback) {
  if (!fs.existsSync(fileName)) {
    throw Error(`${fileName} not exit`);
  }
  ffmpeg.ffprobe(fileName, function (err, data) {
    callback(data);
    const json = JSON.stringify(data);
    fs.writeFile(
      `./metadata/${fileName.split("/").slice(-1)[0].split(".mp4")[0]}.json`,
      json,
      "utf8",
      () => {
        if (err) throw err;
        console.log("complete");
      }
    );
  });
}
