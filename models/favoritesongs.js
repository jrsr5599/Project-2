const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Favoritesongs extends Model {}

Favoritesongs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references : {
        model: 'user',
        key: 'id',
      }
    }
  },  
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Favoritesongs',
  }
);

module.exports = Favoritesongs;
