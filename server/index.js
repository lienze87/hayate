import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, Model, DataTypes } from "sequelize";

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
    episode: DataTypes.NUMBER,
    name: DataTypes.STRING,
    start: DataTypes.STRING,
    startIndex: DataTypes.NUMBER,
    end: DataTypes.STRING,
    endIndex: DataTypes.NUMBER,
    frames: DataTypes.NUMBER,
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
