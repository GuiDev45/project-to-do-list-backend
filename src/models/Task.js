"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Associa a tarefa com o usuário
      Task.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Task.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Task", // Nome do modelo em PascalCase
      tableName: "tasks", // Nome da tabela em snake_case
    },
  );

  return Task;
};
