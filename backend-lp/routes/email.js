const express = require("express");
const router = express.Router();
const { authenticateToken, isAdminOrOwner } = require("../middleware/auth");
const Client = require("../models/client");
const Admin = require("../models/admin");
const User = require("../models/user");
const emailService = require("../services/emailService");

// Enviar email de boas-vindas
router.post("/welcome", authenticateToken, async (req, res) => {
  try {
    const { email, nome } = req.body;
    
    if (!email || !nome) {
      return res.status(400).json({ error: "Parâmetros obrigatórios: email, nome" });
    }
    
    await emailService.sendWelcome(email, nome);
    
    return res.status(200).json({ 
      success: true,
      message: "E-mail de boas-vindas enviado" 
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de boas-vindas:", error);
    return res.status(500).json({ error: "Falha ao enviar e-mail de boas-vindas" });
  }
});

// Enviar promoção para TODOS os clientes
router.post("/promotions/broadcast", authenticateToken, isAdminOrOwner, async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    
    if (!titulo || !descricao) {
      return res.status(400).json({ error: "Parâmetros obrigatórios: titulo, descricao" });
    }
    
    // Buscar todos os clientes
    const clients = await Client.find({}, { email: 1, nome: 1 });
    
    const sendPromises = clients.map(c => emailService.sendPromotion(c.email, titulo, descricao));
    await Promise.allSettled(sendPromises);
    
    return res.status(200).json({ 
      success: true,
      message: `Promoção enviada para ${clients.length} clientes` 
    });
  } catch (error) {
    console.error("Erro ao enviar promoções:", error);
    return res.status(500).json({ error: "Falha ao enviar promoções" });
  }
});

// Enviar comunicação para TODOS os admins
router.post("/admins/broadcast", authenticateToken, isAdminOrOwner, async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    
    if (!titulo || !descricao) {
      return res.status(400).json({ error: "Parâmetros obrigatórios: titulo, descricao" });
    }
    
    const admins = await Admin.find({}, { email: 1, nome: 1 });
    
    const sendPromises = admins.map(a => emailService.sendPromotion(a.email, titulo, descricao));
    await Promise.allSettled(sendPromises);
    
    return res.status(200).json({ 
      success: true,
      message: `Comunicação enviada para ${admins.length} admins` 
    });
  } catch (error) {
    console.error("Erro ao enviar comunicação a admins:", error);
    return res.status(500).json({ error: "Falha ao enviar comunicação aos admins" });
  }
});

// Enviar promoção para cliente específico
router.post("/promotions/client/:clientId", authenticateToken, isAdminOrOwner, async (req, res) => {
  try {
    const { clientId } = req.params;
    const { titulo, descricao } = req.body;
    
    if (!titulo || !descricao) {
      return res.status(400).json({ error: "Parâmetros obrigatórios: titulo, descricao" });
    }
    
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    
    await emailService.sendPromotion(client.email, titulo, descricao);
    
    return res.status(200).json({ 
      success: true,
      message: "Promoção enviada com sucesso" 
    });
  } catch (error) {
    console.error("Erro ao enviar promoção:", error);
    return res.status(500).json({ error: "Falha ao enviar promoção" });
  }
});

module.exports = router;