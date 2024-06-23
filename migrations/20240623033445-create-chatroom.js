"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Chatrooms", {
      roomId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId1: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userId",
        },
      },
      userId2: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userId",
        },
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "ok",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Chatrooms");
  },
};
