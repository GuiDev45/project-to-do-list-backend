"use strict";

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          notEmpty: true,
        },
      },
    },
    {
      tableName: "tokens",
      timestamps: true, // Inclui createdAt e updatedAt
    },
  );

  Token.associate = (models) => {
    Token.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE", // Remove tokens ao excluir usuário
    });
  };

  return Token;
};
