"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupChatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "readerId",
        targetKey: "userId",
      });
      this.hasMany(models.Member, {
        sourceKey: "roomId",
        foreignKey: "roomId",
      });
      this.hasMany(models.GroupMessage, {
        sourceKey: "roomId",
        foreignKey: "roomId",
      });
      this.hasMany(models.GroupPost, {
        sourceKey: "roomId",
        foreignKey: "roomId",
      });
    }
  }
  GroupChatroom.init(
    {
      roomId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      readerId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      status: DataTypes.STRING,
      anonymous: DataTypes.TINYINT,
      profileImage: DataTypes.STRING,
      members: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "GroupChatroom",
    }
  );
  return GroupChatroom;
};
