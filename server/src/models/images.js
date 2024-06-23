import { DataTypes, Model } from 'sequelize';

export class Images extends Model {}
export const ImagesModel = {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  folderPath: DataTypes.STRING,
  videoPath: DataTypes.STRING,
  begin: DataTypes.INTEGER,
  end: DataTypes.INTEGER,
  step: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  describe: DataTypes.STRING,
};
