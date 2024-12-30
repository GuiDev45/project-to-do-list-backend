const express = require("express");
const authenticateJWT = require("../middlewares/authenticateJWT");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/tasksController");

const router = express.Router();

// Criar tarefa
router.post("/", authenticateJWT, createTask);

// Listar tarefas
router.get("/", authenticateJWT, getTasks);

// Atualizar tarefa
router.put("/:id", authenticateJWT, updateTask);

// Deletar tarefa
router.delete("/:id", authenticateJWT, deleteTask);

module.exports = router;
