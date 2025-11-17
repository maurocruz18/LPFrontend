require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const config = require("./config");

// Importar rotas
const clientsRoutes = require("./routes/clients");
const adminsRoutes = require("./routes/admins");
const loginRoutes = require("./routes/login");
const ownerRoutes = require("./routes/owner");
const usersRoutes = require("./routes/users");
const notificationsRoutes = require("./routes/notifications");
const emailRoutes = require("./routes/email");
const authRoutes = require("./routes/authRoutes");
const gamesRoutes = require("./routes/gamesRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

// Conectar ao MongoDB
mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Conectado ao MongoDB!");
}).catch((err) => {
  console.error("❌ Erro ao conectar ao MongoDB:", err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar rotas
app.use("/clients", clientsRoutes); 
app.use("/admins", adminsRoutes); 
app.use("/login", loginRoutes);
app.use("/owner", ownerRoutes);
app.use("/users", usersRoutes);
app.use("/notifications", notificationsRoutes()); 
app.use("/email", emailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/purchases", purchaseRoutes);

// Rota inicial
app.get("/", (req, res) => {
  res.json({ 
    message: "Backend LP Games API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      games: "/api/games",
      purchases: "/api/purchases",
      users: "/users",
      clients: "/clients",
      admins: "/admins",
      owner: "/owner",
      login: "/login",
      notifications: "/notifications",
      email: "/email"
    }
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: "Rota não encontrada",
    path: req.path 
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(500).json({ 
    error: "Erro interno do servidor",
    message: err.message 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});