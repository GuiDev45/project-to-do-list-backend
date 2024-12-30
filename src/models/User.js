"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      username: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      email: DataTypes.STRING,
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Define false como padrão para usuários não admins
      },
    },
    {
      sequelize,
      modelName: "User", // Nome do modelo em PascalCase
      tableName: "users", // Nome da tabela em snake_case
    },
  );
  return users;
};
