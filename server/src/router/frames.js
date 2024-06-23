import { Router } from 'express';
import fs from 'fs';

import { Frames } from '../models/frames.js';
import { Images } from '../models/images.js';
import { extractImageByFrames, extractVideoByTime, getVideoMetadata } from '../video.js';

const framesRouter = new Router();

framesRouter.get('/frames', async (req, res) => {
  const frames = await Frames.findAll({
    where: { sourceName: req.query.sourceName },
    include: { model: Images },
  });
  res.json(frames);
});

framesRouter.get('/frames/:id', async (req, res) => {
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

framesRouter.post('/frames', async (req, res) => {
  const frame = await Frames.create(req.body);
  res.json(frame);
});

framesRouter.put('/frames/:id', async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);
  if (frame) {
    await frame.update(req.body);
    res.json(frame);
  } else {
    res.status(404).json({ message: 'Frames not found' });
  }
});

framesRouter.delete('/frames/:id', async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);
  if (frame) {
    await frame.destroy();
    res.json({ message: 'Frames deleted' });
  } else {
    res.status(404).json({ message: 'Frames not found' });
  }
});

framesRouter.get('/video/:filename', async (req, res) => {
  const videoPath = `./upload/${req.params.filename}`;

  if (!fs.existsSync(videoPath)) {
    res.status(404).json({ message: 'video not found' });
    return;
  }

  const videoStat = fs.statSync(videoPath);
  const videoSize = videoStat.size;

  const videoRange = req.headers.range;
  if (videoRange) {
    const parts = videoRange.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    const chunksize = end - start + 1;

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } else {
    const headers = {
      'Content-Length': videoSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, headers);
    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);
  }
});

framesRouter.get('/videoPart/:id', async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);

  const basePath = `./upload/${frame.sourceName}`;

  const resultFileName = `${frame.sourceName.split('.mp4')[0]}-${frame.startIndex}-${frame.endIndex}.mp4`;
  const videoPath = `./public/${resultFileName}`;
  if (!fs.existsSync(videoPath)) {
    await extractVideoByTime(frame.start, frame.end, basePath, videoPath);
  }

  const videoStat = fs.statSync(videoPath);
  const videoSize = videoStat.size;

  // 添加range后前端播放器才能指定任意秒数开始播放
  const videoRange = req.headers.range;
  if (videoRange) {
    const parts = videoRange.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
    const chunksize = end - start + 1;

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } else {
    const headers = {
      'Content-Length': videoSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, headers);
    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);
  }
});

framesRouter.get('/video/info/:id', async (req, res) => {
  const frame = await Frames.findByPk(req.params.id);

  const basePath = `./upload/${frame.sourceName}`;

  const metaDataPath = `./data/metadata/${frame.sourceName.split('.mp4')[0]}.json`;

  if (fs.existsSync(metaDataPath)) {
    const data = fs.readFileSync(metaDataPath, 'utf8');
    res.json(JSON.parse(data).streams);
  } else {
    getVideoMetadata(basePath, (data) => {
      res.json(data);
    });
  }
});

framesRouter.get('/images/:id', async (req, res) => {
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
    res.status(404).json({ message: 'Images not found' });
  }
});

framesRouter.post('/images', async (req, res) => {
  const frame = await Frames.findByPk(req.body.frameId);

  const resultFileName = `${frame.sourceName.split('.mp4')[0]}-${frame.startIndex}-${frame.endIndex}`;
  const videoPath = `./public/${resultFileName}.mp4`;

  const folderPath = `./public/${resultFileName}`;
  await extractImageByFrames(req.body.begin, req.body.end, videoPath, folderPath, req.body.step);
  await Images.create({
    frameId: req.body.frameId,
    folderPath,
    videoPath,
    begin: req.body.begin,
    end: req.body.end,
    describe: req.body.describe,
  });
  res.json({ message: 'success' });
});

framesRouter.put('/images/:id', async (req, res) => {
  const images = await Images.findByPk(req.params.id);
  if (images) {
    if (images.begin !== req.body.begin || images.end !== req.body.end) {
      await extractImageByFrames(req.body.begin, req.body.end, images.videoPath, images.folderPath, req.body.step);
    }
    await images.update(req.body);
    res.json(images);
  } else {
    res.status(404).json({ message: 'Images not found' });
  }
});

export default framesRouter;
