'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('Bookings', 'booking_status', {
      type: Sequelize.ENUM('confirmed', 'cancelled', 'available'),
      defaultValue: 'available',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('Bookings', 'booking_status', {
      type: Sequelize.ENUM('confirmed', 'cancelled'),
      defaultValue: 'confirmed',
    });
  }
};
