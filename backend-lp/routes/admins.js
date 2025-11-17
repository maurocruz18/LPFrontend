const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const Admin = require("../models/admin");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authenticateToken, isAdmin, isAdminOrOwner } = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// Criar admin
router.post("/create", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const { nome, email, password, telefone } = req.body;
        
        if (!nome || !email || !password || !telefone) {
            return res.status(400).json({ error: "Campos obrigatórios: nome, email, password, telefone" });
        }

        // Verificar se email já existe em User
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email já registrado em users" });
        }

        // Verificar se admin já existe
        const existingAdmin = await AdminController.findByEmail(email);
        if (existingAdmin) {
            return res.status(409).json({ error: "Admin já existe" });
        }

        const hashedPassword = await bcrypt.hash(password.toString(), 10);

        // Criar em User
        const createdUser = await User.create({
            nome,
            email,
            password: hashedPassword,
            telefone,
            role: 'admin'
        });

        // Criar em Admin
        const novoAdmin = await AdminController.create({
            nome,
            email,
            password: hashedPassword,
            telefone,
            role: 'admin'
        });

        res.status(201).json({ 
            success: true,
            message: "Admin criado com sucesso",
            data: novoAdmin 
        });

    } catch (err) {
        console.error("Erro ao criar admin:", err);
        // Limpar User se Admin falhou
        try {
            if (req.body && req.body.email) {
                await User.deleteOne({ email: req.body.email });
            }
        } catch (_) {}
        res.status(500).json({ error: "Erro ao criar admin" });
    }
});

// Buscar todos os admins
router.get("/get", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const admins = await AdminController.findAll();
        res.status(200).json({ 
            success: true,
            count: admins.length,
            data: admins 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar admins" });
    }
});

// Buscar admin por ID
router.get("/get/:id", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const admin = await AdminController.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: "Admin não encontrado" });
        }
        res.status(200).json({ 
            success: true,
            data: admin 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar admin" });
    }
});

// Atualizar admin
router.put("/update/:id", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        const updateData = {};
        
        if (nome) updateData.nome = nome;
        if (email) updateData.email = email;
        if (telefone) updateData.telefone = telefone;

        const adminAtualizado = await AdminController.update(req.params.id, updateData);
        
        if (!adminAtualizado) {
            return res.status(404).json({ error: "Admin não encontrado" });
        }

        res.status(200).json({ 
            success: true,
            message: "Admin atualizado com sucesso",
            data: adminAtualizado 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar admin" });
    }
});

// Deletar admin
router.delete("/delete/:id", authenticateToken, isAdminOrOwner, async (req, res) => {
    try {
        const admin = await AdminController.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: "Admin não encontrado" });
        }

        // Deletar de Admin
        await AdminController.removeById(req.params.id);

        // Deletar de User também
        await User.deleteOne({ email: admin.email });

        res.status(200).json({ 
            success: true,
            message: "Admin deletado com sucesso" 
        });
    } catch (err) {
        console.error("Erro ao deletar admin:", err);
        res.status(500).json({ error: "Erro ao eliminar admin" });
    }
});

module.exports = router;