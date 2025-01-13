import path from 'path';
import { Sequelize } from 'sequelize';

import { __dirname } from '../common.js';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, './data/data.sqlite'),
});

// Sync models with database
// sequelize.sync();
sequelize.sync({ alter: true }); // 在原基础上更新
// sequelize.sync({ force: true }); // 删除再更新
