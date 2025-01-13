import './data/init.js';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';

import commonRouter from './src/router/common.js';
import framesRouter from './src/router/frames.js';
import notesRouter from './src/router/notes.js';

const app = express();
const port = 3005;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 配置defParamCharset解决文件名中的中文乱码
app.use(fileUpload({ defParamCharset: 'utf8' }));

app.use(express.static('public'));
app.use(express.static('upload'));

app.use(commonRouter);
app.use(framesRouter);
app.use(notesRouter);

app.get(/(.*)/, (req, res, next) => {
  console.log(req.path, req.params);
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on: http://localhost:${port}`);
});
