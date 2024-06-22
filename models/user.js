"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Post, {
        sourceKey: "userId",
        foreignKey: "writerId",
      });
      this.hasMany(models.Comment, {
        sourceKey: "userId",
        foreignKey: "writerId",
      });
      this.hasMany(models.GroupPost, {
        sourceKey: "userId",
        foreignKey: "writerId",
      });
      this.hasMany(models.GroupChatroom, {
        sourceKey: "userId",
        foreignKey: "readerId",
      });
      this.hasMany(models.Chatroom, {
        sourceKey: "userId",
        foreignKey: "user1",
        as : 'user1'
      });
      this.hasMany(models.Chatroom, {
        sourceKey: "userId",
        foreignKey: "user2",
        as : 'user2'
      });
      this.hasMany(models.ChatMessage, {
        sourceKey: "userId",
        foreignKey: "userId",
      });
      this.hasMany(models.Notification, {
        sourceKey: "userId",
        foreignKey: "userId",
      });
      this.hasMany(models.Member, {
        sourceKey: "userId",
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      nickname: DataTypes.STRING,
      role: DataTypes.STRING,
      status: DataTypes.STRING,
      profileImage: DataTypes.STRING,
      blockDate: DataTypes.DATE,
      tier: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
