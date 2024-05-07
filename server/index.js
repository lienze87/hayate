import fs from "fs";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, Model, DataTypes } from "sequelize";
import { cutVideoByTime } from "./video.js";

const app = express();
const port = 3005;

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./info.sqlite",
});

// Define Frames model
class Frames extends Model {}
Frames.init(
  {
    uuid: DataTypes.STRING,
    // uuid: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    // },
    episode: DataTypes.INTEGER,
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

// Sync models with database
sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(cors());

app.get("/frames", async (req, res) => {
  const frames = await Frames.findAll();
  res.json(frames);
});

app.get("/frames/:id", async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);
  res.json(frame);
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
  const videoPath = `./public/Sousou_no_Frieren_S01E${req.query.episode || "01"}.mp4`;
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

  const inputFileName = `Sousou_no_Frieren_S01E${("0" + frame.episode).slice(-2)}.mp4`;
  const basePath = `C:/Users/Administrator/Videos/${inputFileName}`;

  const resultFileName = `S01E${("0" + frame.episode).slice(-2)}%${frame.startIndex}-${frame.endIndex}.mp4`;
  const videoPath = `./public/${resultFileName}`;
  if (!fs.existsSync(videoPath)) {
    await cutVideoByTime(frame.start, frame.end, basePath, videoPath);
  }
  const videoStat = fs.statSync(videoPath);
  const videoSize = videoStat.size;

  const headers = {
    "Content-Length": videoSize,
    "Content-Type": "video/mp4",
  };
  res.writeHead(200, headers);
  const videoStream = fs.createReadStream(videoPath);
  videoStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
