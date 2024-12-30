// controllers/tasksController.js
const { Task } = require("../models");

exports.createTask = async (req, res) => {
  try {
    const { text, status } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Texto da tarefa é obrigatório." });
    }

    // Criação da tarefa associada ao usuário
    const task = await Task.create({
      user_id: req.user.userId, // Associa a tarefa ao ID do usuário logado
      text,
      status: status || false, // Se o status não for enviado, o valor padrão será false
    });

    return res
      .status(201)
      .json({ message: "Tarefa criada com sucesso!", task });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao criar tarefa.", error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.userId; // ID do usuário logado

    const tasks = await Task.findAll({ where: { user_id: userId } });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Nenhuma tarefa encontrada." });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao listar tarefas.", error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, status } = req.body;
    const userId = req.user.userId; // ID do usuário logado

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    // Verifica se o usuário logado é o proprietário da tarefa
    if (task.user_id !== userId) {
      return res.status(403).json({
        message: "Acesso proibido. Você não pode editar essa tarefa.",
      });
    }

    // Atualiza a tarefa com os novos valores
    if (text) task.text = text;
    if (status !== undefined) task.status = status;

    await task.save(); // Salva as mudanças no banco de dados

    return res
      .status(200)
      .json({ message: "Tarefa atualizada com sucesso!", task });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar tarefa.", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // ID do usuário logado

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    // Verifica se o usuário logado é o proprietário da tarefa
    if (task.user_id !== userId) {
      return res.status(403).json({
        message: "Acesso proibido. Você não pode deletar essa tarefa.",
      });
    }

    await task.destroy(); // Deleta a tarefa do banco de dados

    return res.status(200).json({ message: "Tarefa deletada com sucesso." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao deletar tarefa.", error: error.message });
  }
};
