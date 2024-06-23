import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import { Sequelize } from 'sequelize';

import { Frames, FramesModel } from './src/models/frames.js';
import { Images, ImagesModel } from './src/models/images.js';
import { Notes, NotesModel } from './src/models/notes.js';
import commonRouter from './src/router/common.js';
import framesRouter from './src/router/frames.js';
import notesRouter from './src/router/notes.js';

const app = express();
const port = 3005;

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './info.sqlite',
});

// 第二个参数可以传入{ sequelize, paranoid: true, modelName: "frames" }
// paranoid：true表示软删除
Frames.init(FramesModel, { sequelize, modelName: 'frames' });

Images.init(ImagesModel, { sequelize, modelName: 'images' });

// 关系一对多
Frames.hasMany(Images);
// 自动插入外键 frameId
Images.belongsTo(Frames);

Notes.init(NotesModel, { sequelize, modelName: 'notes' });

// Sync models with database
sequelize.sync();
// sequelize.sync({ alter: true }); // 在原基础上更新
// sequelize.sync({ force: true }); // 删除再更新

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 配置defParamCharset解决文件名中的中文乱码
app.use(fileUpload({ defParamCharset: 'utf8' }));

app.use(express.static('public'));

app.use(commonRouter);
app.use(framesRouter);
app.use(notesRouter);

app.get('/check', (req, res) => {
  res.json({
    data: 200,
    message: 'success',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on: http://localhost:${port}`);
});
