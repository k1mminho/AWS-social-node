"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "writerId",
        targetKey: "userId",
      });
      this.belongsTo(models.GroupChatroom, {
        foreignKey: "roomId",
        targetKey: "roomId",
      });
      this.hasMany(models.Comment, {
        sourceKey: "postId",
        foreignKey: "postId",
      });
    }
  }
  GroupPost.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      roomId: DataTypes.INTEGER,
      writerId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      category: DataTypes.STRING,
      status: DataTypes.STRING,
      readhit: DataTypes.INTEGER,
      likes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "GroupPost",
    }
  );
  return GroupPost;
};
