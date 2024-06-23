import { Router } from 'express';
import fs from 'fs';

import { getFileExtension } from '../utils.js';
import { getVideoMetadata, getVideoPoster } from '../video.js';

const commonRouter = new Router();

commonRouter.post('/upload', (req, res) => {
  let sampleFile = null;
  const uploadPath = './upload/';

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.file;

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
  const folderPath = './upload/';
  const files = fs.readdirSync(folderPath);
  const result = files.filter((file) => {
    return getFileExtension(file) === req.params.extension;
  });

  res.json(result);
});

export default commonRouter;
