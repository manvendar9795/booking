"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const hashedPassword = await bcrypt.hash("admin123", 10); // Hash password


    await queryInterface.bulkInsert("Users", [
      {
        firstName: "Super",
        lastName: "Admin",
        mobile:"1212121212",
        email: "admin@example.com",
        access_token:"",
        password:"00000000",
        user_type: "admin",
        status:"active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
