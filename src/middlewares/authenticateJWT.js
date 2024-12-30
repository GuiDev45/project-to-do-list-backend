const jwt = require("jsonwebtoken");
const { Token } = require("../models"); // Importando o modelo Token

const authenticateJWT = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso não autorizado. Token necessário." });
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica se o token está presente na tabela de tokens
    const storedToken = await Token.findOne({ where: { token } });

    if (!storedToken) {
      return res
        .status(403)
        .json({ message: "Token inválido ou não registrado." });
    }

    // Verifica se o token expirou
    const now = new Date();
    if (storedToken.expires_at < now) {
      return res.status(403).json({ message: "Token expirado." });
    }

    // Armazenando os dados decodificados no req.user
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      admin: decoded.admin, // Inclui o status de admin
    };

    next(); // Continua para o próximo middleware ou rota
  } catch (error) {
    console.error("Erro ao validar token:", error.message);
    return res.status(403).json({ message: "Token inválido ou expirado." });
  }
};

module.exports = authenticateJWT;
