// declared model and requiring sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//class defining the model
class Favoritesongs extends Model {}

// model for Favoritesongs table in the db
Favoritesongs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    album: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Favoritesongs',
  }
);

// export model
module.exports = Favoritesongs;
