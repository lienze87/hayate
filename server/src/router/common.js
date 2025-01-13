import { Router } from 'express';
import fs from 'fs';
import path from 'path';

import { __dirname } from '../../common.js';
import { getVideoMetadata, getVideoPoster } from '../utils/video.js';

const commonRouter = new Router();

commonRouter.get('/check', (req, res) => {
  res.json({
    data: 200,
    message: 'server is running',
  });
});

commonRouter.post('/upload', (req, res) => {
  let sampleFile = null;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.file;

  const fileExtension = sampleFile.name.split('.').pop();
  const uploadPath = path.join(__dirname, `./upload/${fileExtension}/`);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  const filePath = uploadPath + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  return sampleFile.mv(filePath, (err) => {
    if (err) return res.status(500).send(err);
    if (sampleFile.name.split('.').pop() === 'mp4') {
      getVideoPoster(filePath, `./public/${sampleFile.name.split('.mp4')[0]}.jpg`);
      const metaDataPath = `./data/metadata/${sampleFile.name.split('.mp4')[0]}.json`;

      if (!fs.existsSync(metaDataPath)) {
        getVideoMetadata(filePath, () => {});
      }
    }
    return res.json({
      data: sampleFile.name,
      message: 'success',
    });
  });
});

commonRouter.get('/upload/:extension', (req, res) => {
  const folderPath = path.join(__dirname, `./upload/${req.params.extension}`);
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    res.json({
      data: files.sort((a, b) => {
        const aNum = a.match(/\d+/);
        const bNum = b.match(/\d+/);
        if (!aNum || !bNum) {
          return a.localeCompare(b);
        }
        return parseInt(aNum[0]) - parseInt(bNum[0]);
      }),
      message: 'success',
    });
  } else {
    res.json({
      data: [],
      message: 'success',
    });
  }
});

export default commonRouter;
