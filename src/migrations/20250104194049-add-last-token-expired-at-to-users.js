"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "last_token_expired_at", {
      type: Sequelize.DATE,
      allowNull: true, // Permite nulo inicialmente
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "last_token_expired_at");
  },
};
