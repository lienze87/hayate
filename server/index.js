import fs from "fs";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { Sequelize, Model, DataTypes } from "sequelize";
import { extractImageByFrames, getVideoMetadata } from "./video.js";

const app = express();
const port = 3005;

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./info.sqlite",
});

// Define Frames model
class Frames extends Model {}
// 第二个参数可以传入{ sequelize, paranoid: true, modelName: "frames" }
// paranoid：true表示软删除
Frames.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    sourceName: DataTypes.STRING,
    name: DataTypes.STRING,
    start: DataTypes.STRING,
    startIndex: DataTypes.INTEGER,
    end: DataTypes.STRING,
    endIndex: DataTypes.INTEGER,
    frames: DataTypes.INTEGER,
    describe: DataTypes.STRING,
  },
  { sequelize, modelName: "frames" }
);

class Images extends Model {}
Images.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    folderPath: DataTypes.STRING,
    videoPath: DataTypes.STRING,
    begin: DataTypes.INTEGER,
    end: DataTypes.INTEGER,
    describe: DataTypes.STRING,
  },
  { sequelize, modelName: "images" }
);

// 关系一对多
Frames.hasMany(Images);
// 自动插入外键 frameId
Images.belongsTo(Frames);

class Notes extends Model {}
Notes.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    context: DataTypes.TEXT,
    describe: DataTypes.STRING,
  },
  { sequelize, modelName: "notes" }
);

// Sync models with database
sequelize.sync();
// sequelize.sync({ alter: true }); // 在原基础上更新
// sequelize.sync({ force: true }); // 删除再更新

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 配置defParamCharset解决文件名中的中文乱码
app.use(fileUpload({ defParamCharset: "utf8" }));

app.use(express.static("public"));

app.post("/upload", function (req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.file;

  uploadPath = "./upload/" + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.json({ message: "success" });
  });
});

app.get("/frames", async (req, res) => {
  const frames = await Frames.findAll({
    include: { model: Images },
  });
  res.json(frames);
});

app.get("/frames/:id", async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);
  // const imagesList = await Images.findAll({
  //   attributes: ["id", "uuid", "frameId", "begin", "end", "describe"],
  //   where: {
  //     frameId: frame.id,
  //   },
  // });
  // getImages为sequelize自动生成的方法
  const images = await frame.getImages();
  res.json({ ...frame.dataValues, images });
});

app.post("/frames", async (req, res) => {
  const frame = await Frames.create(req.body);
  res.json(frame);
});

app.put("/frames/:id", async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);
  if (frame) {
    await frame.update(req.body);
    res.json(frame);
  } else {
    res.status(404).json({ message: "Frames not found" });
  }
});

app.delete("/frames/:id", async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);
  if (frame) {
    await frame.destroy();
    res.json({ message: "Frames deleted" });
  } else {
    res.status(404).json({ message: "Frames not found" });
  }
});

app.get("/video", async (req, res) => {
  const videoPath = `./upload/${req.query.fileName}`;

  if (!fs.existsSync(videoPath)) {
    res.status(404).json({ message: "video not found" });
    return;
  }
  const videoStat = fs.statSync(videoPath);
  const videoSize = videoStat.size;

  const videoRange = req.headers.range;
  if (videoRange) {
    const parts = videoRange.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    const chunksize = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } else {
    const headers = {
      "Content-Length": videoSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, headers);
    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);
  }
});

app.get("/video/:id", async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);

  const basePath = `./upload/${frame.sourceName}`;

  const resultFileName = `${frame.sourceName.split(".mp4")[0]}-${frame.startIndex}-${frame.endIndex}.mp4`;
  const videoPath = `./public/${resultFileName}`;
  if (!fs.existsSync(videoPath)) {
    await extractVideoByTime(frame.start, frame.end, basePath, videoPath);
  }

  const videoStat = fs.statSync(videoPath);
  const videoSize = videoStat.size;

  // 添加range后前端播放器才能指定任意秒数开始播放
  const videoRange = req.headers.range;
  if (videoRange) {
    const parts = videoRange.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    const chunksize = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } else {
    const headers = {
      "Content-Length": videoSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, headers);
    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);
  }
});

app.get("/video/info/:id", async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);

  const basePath = `./upload/${frame.sourceName}`;

  const metaDataPath = `./metadata/${frame.sourceName.split(".mp4")[0]}.json`;

  if (fs.existsSync(metaDataPath)) {
    const data = fs.readFileSync(metaDataPath, "utf8");
    res.json(data);
  } else {
    getVideoMetadata(basePath, (data) => {
      res.json(data);
    });
  }
});

app.get("/images/:id", async (req, res) => {
  const images = await Images.findByPk(req.params.id);
  if (images) {
    const filePath = images.folderPath;
    const fileList = fs
      .readdirSync(filePath)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => {
        return `${filePath}/${file}`;
      });

    res.json(fileList);
  } else {
    res.status(404).json({ message: "Images not found" });
  }
});

app.post("/images", async (req, res) => {
  const frame = await Frames.findByPk(req.body.frameId);

  const resultFileName = `${frame.sourceName.split(".mp4")[0]}-${frame.startIndex}-${frame.endIndex}`;
  const videoPath = `./public/${resultFileName}.mp4`;

  const folderPath = `./public/${resultFileName}`;
  await extractImageByFrames(
    req.body.begin,
    req.body.end,
    videoPath,
    folderPath
  );
  await Images.create({
    frameId: req.body.frameId,
    folderPath: folderPath,
    videoPath: videoPath,
    begin: req.body.begin,
    end: req.body.end,
    describe: req.body.describe,
  });
  res.json({ message: "success" });
});

app.put("/images/:id", async (req, res) => {
  const images = await Images.findByPk(req.params.id);
  if (images) {
    if (images.begin !== req.body.begin || images.end !== req.body.end) {
      await extractImageByFrames(
        req.body.begin,
        req.body.end,
        images.videoPath,
        images.folderPath
      );
    }
    await images.update(req.body);
    res.json(images);
  } else {
    res.status(404).json({ message: "Images not found" });
  }
});

app.get("/notes", async (req, res) => {
  const notes = await Notes.findAll();
  res.json(notes);
});

app.get("/notes/:id", async (req, res) => {
  const note = await Frames.findByPk(req.params.id);

  res.json(note);
});

app.post("/notes", async (req, res) => {
  const note = await Notes.create(req.body);
  res.json(note);
});

app.put("/notes/:id", async (req, res) => {
  const note = await Notes.findByPk(req.params.id);
  if (note) {
    await note.update(req.body);
    res.json(note);
  } else {
    res.status(404).json({ message: "Notes not found" });
  }
});

app.delete("/notes/:id", async (req, res) => {
  const note = await Notes.findByPk(req.params.id);
  if (note) {
    await note.destroy();
    res.json({ message: "Notes deleted" });
  } else {
    res.status(404).json({ message: "Notes not found" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on: http://localhost:${port}`);
});
