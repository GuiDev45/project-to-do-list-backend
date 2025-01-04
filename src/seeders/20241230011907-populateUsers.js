"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Gerando os hashes das senhas
      const hashedPassword1 = await bcrypt.hash("password123", 10);
      const hashedPassword2 = await bcrypt.hash("password456", 10);
      const hashedPassword3 = await bcrypt.hash("password789", 10);

      // Inserindo os usuários na tabela `users`
      await queryInterface.bulkInsert("users", [
        {
          username: "john_doe",
          password_hash: hashedPassword1,
          email: "john.doe@example.com",
          admin: false, // Definindo 'admin' como false (não administrador)
          last_token_expired_at: null, // Nenhuma data de expiração do token
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "jane_smith",
          password_hash: hashedPassword2,
          email: "jane.smith@example.com",
          admin: true, // Definindo 'admin' como true (administrador)
          last_token_expired_at: null, // Nenhuma data de expiração do token
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "bob_jones",
          password_hash: hashedPassword3,
          email: "bob.jones@example.com",
          admin: false, // Definindo 'admin' como false (não administrador)
          last_token_expired_at: null, // Nenhuma data de expiração do token
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      console.log("Usuários inseridos com sucesso!");
    } catch (error) {
      console.error("Erro ao inserir usuários:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remover os dados inseridos no processo de "down"
    await queryInterface.bulkDelete("users", null, {});
  },
};
