"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users", // Nome da tabela que é referenciada
          key: "id", // Chave primária da tabela users
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Caso o usuário seja deletado, o user_id será setado para NULL
      },
      text: {
        type: Sequelize.STRING, // varchar
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Valor padrão para status
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tasks");
  },
};
