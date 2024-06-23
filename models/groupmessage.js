'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupMessage.init({
    messageId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    roomId: DataTypes.INTEGER,
    memberId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    isRead: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GroupMessage',
  });
  return GroupMessage;
};