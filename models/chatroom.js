"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId1",
        targetKey: "userId",
      });
      this.belongsTo(models.User, {
        foreignKey: "userId2",
        targetKey: "userId",
      });
      this.hasMany(models.ChatMessage, {
        sourceKey: "roomId",
        foreignKey: "roomId",
      });
    }
  }
  Chatroom.init(
    {
      roomId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId1: DataTypes.INTEGER,
      userId2: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Chatroom",
    }
  );
  return Chatroom;
};
