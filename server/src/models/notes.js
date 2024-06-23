import { DataTypes, Model } from 'sequelize';

// Define Frames model
export class Notes extends Model {}
export const NotesModel = {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  context: DataTypes.TEXT,
  describe: DataTypes.STRING,
};
