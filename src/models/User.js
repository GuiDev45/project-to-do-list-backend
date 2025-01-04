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
      last_token_expired_at: {
        type: DataTypes.DATE,
        allowNull: true, // Pode ser nulo inicialmente
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    },
  );

  return users;
};
