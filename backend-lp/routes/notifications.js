const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Notification = require("../models/notification");
const NotificationController = require("../controllers/NotificationController");
const Cliente = require("../models/client");
const { authenticateToken, isAdmin, isClient, isAdminOrClient, isAdminOrOwner } = require("../middleware/auth");

function NotificationRouter() {
    let router = express.Router();
    
    // middleware body-parser
    router.use(bodyParser.json({ limit: "100mb" }));
    router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
    
    // Middleware to logging
    router.use(function (req, res, next) {
        console.log("Hora da requisição de notificação:", new Date().toLocaleString());
        next();
    });

    // send promotion to a specific client
    router.post("/clientes/:clienteId/promocoes", authenticateToken, isAdminOrOwner, async (req, res) => {
        console.log("=== ROTA PROMOÇÃO CLIENTE ESPECÍFICO ===");
        console.log("URL:", req.url);
        console.log("Método:", req.method);
        console.log("Params:", req.params);
        console.log("Body:", req.body);
        
        const { clienteId } = req.params;
        const { titulo, mensagem } = req.body;

        try {
            // Verify if client exists
            const cliente = await Cliente.findById(clienteId);
            if (!cliente) {
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            const notificacao = await NotificationController.criarNotificacao(
                clienteId,
                titulo,
                mensagem,
                "promocao"
            );

            res.status(201).json({ 
                message: "Promoção enviada com sucesso!", 
                notificacao 
            });
        } catch (err) {
            console.error("Erro ao enviar promoção:", err);
            res.status(500).json({ error: "Erro ao enviar promoção" });
        }
    });

    // send notification to a specific client
    router.post(
        "/clientes/:clienteId/notificacoes",
        authenticateToken,
        isAdminOrOwner,
        async (req, res) => {
            const { clienteId } = req.params;
            const { titulo, mensagem, tipo } = req.body;

            try {
                const notificacao = await NotificationController.criarNotificacao(
                    clienteId,
                    titulo,
                    mensagem,
                    tipo
                );
                res.status(201).json(notificacao);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    );


    // send promotion to ALL clients
    router.post("/promocoes", authenticateToken, isAdminOrOwner, async (req, res) => {
        const { titulo, mensagem } = req.body;
        try {
            const clientes = await Cliente.find();
            console.log("Clientes encontrados:", clientes.length);

            const notificacoes = await Promise.all(
                clientes.map((cliente) => {
                    console.log("Enviando para:", cliente._id, titulo, mensagem);
                    return NotificationController.criarNotificacao(
                        cliente._id,
                        titulo,
                        mensagem,
                        "promocao"
                    );
                })
            );

            res.status(200).json({ 
                message: "Notificações de promoção enviadas!", 
                notificacoes 
            });
        } catch (err) {
            console.error("Erro ao enviar notificações de promoção:", err);
            res.status(500).json({ error: "Erro ao enviar notificações de promoção" });
        }
    });

    // search all promotions
    router.get("/promocoes", authenticateToken, isAdminOrOwner, async (req, res) => {
        try {
            const promocoes = await NotificationController.obterPromocoes("promocao");
            res.status(200).json(promocoes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // search notifications for a specific client
    router.get("/clientes/:userId/notificacoes", authenticateToken, isClient, async (req, res) => {
        const { userId } = req.params;

        try {
            
            if (req.user.id !== userId) {
                return res.status(403).json({ error: "Acesso negado." });
            }

            const cliente = await Cliente.findOne({ user: userId });
            if (!cliente) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

        
            const notificacoes = await NotificationController.obterNotificacoesPorCliente(cliente._id);
            res.status(200).json(notificacoes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // send promotion to a specific client
    router.get("/clientes/:clienteId/promocoes", authenticateToken, isClient, async (req, res) => {
        const { clienteId } = req.params;
        try {
            const promocoes = await Notification.find({
                cliente: clienteId,
                tipo: "promocao"
            }).sort({ dataEnvio: -1 });
            res.status(200).json(promocoes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Mark all notifications as seen for a specific client
    router.put("/clientes/user/:userId/notificacoes/visto", authenticateToken, isClient, async (req, res) => {
        try {
            
            if (req.user.id !== req.params.userId) {
                return res.status(403).json({ error: "Acesso negado." });
            }

            const cliente = await Cliente.findOne({ user: req.params.userId });
            if (!cliente) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            
            await Notification.updateMany(
                { cliente: cliente._id },
                { $set: { visto: true } }
            );

            res.status(200).json({ message: "Notificações marcadas como vistas." });
        } catch (err) {
            res.status(500).json({ error: "Erro ao atualizar notificações." });
        }
    });

    // Mark a specific notification as seen for a specific client
    router.put("/clientes/user/:userId/notificacoes/:notificacaoId/visto", authenticateToken, isClient, async (req, res) => {
        try {
            if (req.user.id !== req.params.userId) {
                return res.status(403).json({ error: "Acesso negado." });
            }

            const cliente = await Cliente.findOne({ user: req.params.userId });
            if (!cliente) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            
            const notificacao = await Notification.findOneAndUpdate(
                { _id: req.params.notificacaoId, cliente: cliente._id },
                { $set: { visto: true } },
                { new: true }
            );

            if (!notificacao) {
                return res.status(404).json({ error: "Notificação não encontrada." });
            }

            res.status(200).json({ message: "Notificação marcada como vista.", notificacao });
        } catch (err) {
            res.status(500).json({ error: "Erro ao atualizar notificação." });
        }
    });

    return router;
}

module.exports = NotificationRouter;