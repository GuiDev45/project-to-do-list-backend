const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const authenticateJWT = require("../middlewares/authenticateJWT");

const router = express.Router();

// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
  if (!req.user.admin) {
    return res.status(403).json({
      message: "Acesso negado. Apenas administradores podem acessar.",
    });
  }
  next();
};

// Rota protegida para acessar o perfil do usuário logado (deve vir antes da rota :id)
router.get("/profile", authenticateJWT, (req, res) => {
  res.json({
    message: "Bem-vindo ao perfil do usuário!",
    userId: req.user.userId,
    username: req.user.username,
    admin: req.user.admin,
  });
});

// Rota protegida para obter todos os usuários (apenas para administradores)
router.get("/", authenticateJWT, isAdmin, getAllUsers);

// Rota protegida para obter um usuário por ID (usuário comum só pode acessar seu próprio perfil)
router.get("/:id", authenticateJWT, getUserById);

// Rota protegida para atualizar um usuário (usuário comum só pode atualizar seu próprio perfil)
router.put("/:id", authenticateJWT, updateUser);

// Rota protegida para deletar um usuário (apenas administradores podem deletar usuários)
router.delete("/:id", authenticateJWT, isAdmin, deleteUser);

module.exports = router;
