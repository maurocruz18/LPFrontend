const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/ClientController");
const Client = require("../models/client");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authenticateToken, isAdminOrOwner, isClient } = require("../middleware/auth");

// Criar cliente
router.post("/create", async (req, res) => {
    try {
        const { nome, email, password, telefone, age, dateOfBirth } = req.body;
        
        if (!nome || !email || !password || !telefone || !age) {
            return res.status(400).json({ error: "Campos obrigatórios: nome, email, password, telefone, age" });
        }

        // Verificar se email já existe em User
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email já registrado" });
        }

        const hashedPassword = await bcrypt.hash(password.toString(), 10);

        // Criar em User
        const createdUser = await User.create({
            nome,
            email,
            password: hashedPassword,
            telefone,
            age,
            dateOfBirth,
            role: 'client'
        });

        // Criar em Client
        const novoClient = await ClientController.create({
            nome,
            email,
            password: hashedPassword,
            telefone,
            age,
            dateOfBirth,
            role: 'client',
            user: createdUser._id
        });

        res.status(201).json({ 
            success: true,
            message: "Cliente criado com sucesso",
            data: novoClient 
        });

    } catch (err) {
        console.error("Erro ao criar cliente:", err);
        // Limpar User se Client falhou
        try {
            if (req.body && req.body.email) {
                await User.deleteOne({ email: req.body.email });
            }
        } catch (_) {}
        res.status(500).json({ error: "Erro ao criar cliente" });
    }
});

// Buscar todos os clientes
router.get("/get", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const clients = await ClientController.findAll();
        res.status(200).json({ 
            success: true,
            count: clients.length,
            data: clients 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar clientes" });
    }
});

// Buscar cliente por ID
router.get("/get/:id", authenticateToken, async (req, res) => {
    try {
        const client = await ClientController.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        // Verificar permissões
        if (req.user.role === 'client' && client.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        res.status(200).json({ 
            success: true,
            data: client 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar cliente" });
    }
});

// Atualizar cliente
router.put("/update/:id", authenticateToken, async (req, res) => {
    try {
        const client = await ClientController.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        // Verificar permissões
        if (req.user.role === 'client' && client.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        const { nome, telefone, age } = req.body;
        const updateData = {};
        
        if (nome) updateData.nome = nome;
        if (telefone) updateData.telefone = telefone;
        if (age) updateData.age = age;

        const clientAtualizado = await ClientController.update(req.params.id, updateData);

        res.status(200).json({ 
            success: true,
            message: "Cliente atualizado com sucesso",
            data: clientAtualizado 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
});

// Deletar cliente
router.delete("/delete/:id", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const client = await ClientController.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        // Deletar de Client
        await ClientController.removeById(req.params.id);

        // Deletar de User também
        await User.deleteOne({ _id: client.user });

        res.status(200).json({ 
            success: true,
            message: "Cliente deletado com sucesso" 
        });
    } catch (err) {
        console.error("Erro ao deletar cliente:", err);
        res.status(500).json({ error: "Erro ao eliminar cliente" });
    }
});

module.exports = router;