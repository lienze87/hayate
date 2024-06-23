import { DataTypes, Model } from 'sequelize';

// Define Frames model
export class Frames extends Model {}
export const FramesModel = {
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
};
