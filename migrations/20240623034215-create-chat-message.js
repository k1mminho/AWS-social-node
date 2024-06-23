"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chatMessages", {
      messageId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roomId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Chatrooms",
          key: "roomId",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userId",
        },
      },
      content: {
        type: Sequelize.STRING,
      },
      isRead: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
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
    await queryInterface.dropTable("chatMessages");
  },
};
