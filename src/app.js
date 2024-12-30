const express = require("express");
const webRoutes = require("./routes/webRoutes"); // Rotas públicas
const protectedRoutes = require("./routes/protectedRoutes"); // Rotas protegidas
const taskRoutes = require("./routes/taskRoutes"); // Rotas de tarefas

const app = express();

// Middleware para parse do corpo da requisição
app.use(express.json()); // Parse de JSON embutido no Express

// Usando as rotas
app.use("/users", webRoutes); // Rotas públicas
app.use("/protected", protectedRoutes); // Rotas protegidas
app.use("/tasks", taskRoutes); // Rotas de tarefas

// Iniciando o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor escutando na porta 3000");
});
