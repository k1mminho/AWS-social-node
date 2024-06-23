"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "GroupPosts",
      [
        {
          roomId: 1,
          writerId: 1,
          title: "testTitle",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("GroupPosts", null, {});
  },
};
