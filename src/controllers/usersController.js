const { User } = require("../models"); // Importando os modelos User
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Chave secreta para assinatura do JWT (em produção, use variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET;

// Criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email já cadastrado!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password_hash: hashedPassword,
      email,
      admin: false,
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

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    // Geração do token com expiração de 1 hora
    const token = jwt.sign(
      { userId: user.id, username: user.username, admin: user.admin },
      JWT_SECRET,
      { expiresIn: "1h" }, // Expira em 1 hora
    );

    return res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao fazer login", error: error.message });
  }
};

// Logout de um usuário (atualiza last_token_expired_at)
exports.logoutUser = async (req, res) => {
  try {
    const { userId } = req.user; // ID do usuário autenticado (do token)

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Atualizando o campo `last_token_expired_at`
    await user.update({ last_token_expired_at: new Date() });

    return res.status(200).json({ message: "Logout realizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao realizar logout", error: error.message });
  }
};

// Middleware para validar token e last_token_expired_at
exports.validateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (
      user.last_token_expired_at &&
      new Date(decoded.iat * 1000) < user.last_token_expired_at
    ) {
      return res.status(401).json({ message: "Token expirado ou revogado" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Obter todos os usuários (incluindo last_token_expired_at opcionalmente)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({
        message: "Acesso negado. Apenas administradores podem acessar.",
      });
    }

    const users = await User.findAll({
      attributes: ["id", "username", "email", "admin", "last_token_expired_at"],
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
    const { id } = req.params;

    if (req.user.userId !== parseInt(id) && !req.user.admin) {
      return res
        .status(403)
        .json({ message: "Acesso proibido. Permissão insuficiente." });
    }

    const user = await User.findByPk(id, {
      attributes: ["id", "username", "email", "admin", "last_token_expired_at"],
    });

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

    // Verificar se o usuário autenticado é o mesmo ou se é um admin
    if (req.user.userId !== parseInt(id) && !req.user.admin) {
      return res
        .status(403)
        .json({ message: "Acesso proibido. Permissão insuficiente." });
    }

    let hashedPassword = user.password_hash;

    // Verificar se o usuário quer atualizar a senha
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Verificar se o usuário comum está tentando alterar o e-mail
    if (!req.user.admin && email) {
      return res.status(403).json({
        message: "Acesso proibido. Usuários comuns não podem alterar o e-mail.",
      });
    }

    // Atualiza o usuário com os novos dados, mas não permite alterar o e-mail para usuários comuns
    await user.update({
      username: username || user.username,
      password_hash: hashedPassword,
      email: email && req.user.admin ? email : user.email, // Só permite alterar o e-mail para admins
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

    await user.destroy();
    return res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao deletar usuário", error: error.message });
  }
};
