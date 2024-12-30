"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "admin", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Usuários padrão não são administradores
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "admin");
  },
};
