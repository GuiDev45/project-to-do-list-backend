const jwt = require("jsonwebtoken");

// Chave secreta para assinatura do JWT
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401) // Token não fornecido
      .json({ message: "Acesso não autorizado. Token necessário." });
  }

  try {
    // Verifica se o token é válido e decodifica
    const decoded = jwt.verify(token, JWT_SECRET);

    // Armazenando os dados decodificados no req.user
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      admin: decoded.admin, // Inclui o status de admin
    };

    next(); // Continua para o próximo middleware ou rota
  } catch (error) {
    console.error("Erro ao validar token:", error.message);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

module.exports = authenticateJWT;
