const { User, Token } = require("../models"); // Importando os modelos User e Token
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Chave secreta para assinatura do JWT (em produção, use variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET;

// Criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Verificar se o e-mail já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email já cadastrado!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário com admin como falso por padrão
    const newUser = await User.create({
      username,
      password_hash: hashedPassword,
      email,
      admin: false, // Apenas admins criados manualmente
    });

    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso!", user: newUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao criar usuário", error: error.message });
  }
};

// Login de um usuário (gera o JWT)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificando se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    // Verificando se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    // Gerando o token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, admin: user.admin }, // Incluindo 'admin' aqui
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // O token expira em 1 hora
    );

    // Salvando o token na tabela tokens
    const expiresAt = new Date(Date.now() + 3600 * 1000); // Expira em 1 hora
    await Token.create({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    return res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao fazer login", error: error.message });
  }
};

// Obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({
        message: "Acesso negado. Apenas administradores podem acessar.",
      });
    }

    const users = await User.findAll({
      attributes: ["id", "username", "email", "admin"], // Filtrando campos para retorno
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao obter os usuários", error: error.message });
  }
};

// Obter um usuário por ID
exports.getUserById = async (req, res) => {
  try {
    // Desestruturando o id da URL
    const { id } = req.params;

    // Verificando se o id é um número válido
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: `ID inválido: ${id}.` });
    }

    // Verificando se o usuário autenticado é o mesmo ou se é um admin
    if (req.user.userId !== parseInt(id) && !req.user.admin) {
      return res
        .status(403)
        .json({ message: "Acesso proibido. Permissão insuficiente." });
    }

    // Buscando o usuário no banco
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar usuário", error: error.message });
  }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    let hashedPassword = user.password_hash;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      username: username || user.username,
      password_hash: hashedPassword,
      email: email || user.email,
    });

    return res
      .status(200)
      .json({ message: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar usuário", error: error.message });
  }
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Remover os tokens associados ao usuário
    await Token.destroy({ where: { user_id: user.id } });

    await user.destroy();
    return res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao deletar usuário", error: error.message });
  }
};
