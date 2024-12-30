const express = require("express");
const { createUser, loginUser } = require("../controllers/usersController");

const router = express.Router();

// Rota pública para criar um novo usuário
router.post("/register", createUser);

// Rota pública para login de usuário e geração de token
router.post("/login", loginUser);

module.exports = router;
