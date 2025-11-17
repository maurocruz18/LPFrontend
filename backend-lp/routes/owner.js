const express = require("express");
const router = express.Router();
const OwnerController = require("../controllers/OwnerController");
const Owner = require("../models/owner");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { authenticateToken, isOwner } = require("../middleware/auth");

// Criar owner
router.post("/create", async (req, res) => {
    try {
        const existingOwner = await OwnerController.findAll();

        // Se já existe owner, apenas owner autenticado pode criar outro
        if (existingOwner.length > 0) {
            if (!req.user) {
                return res.status(401).json({ error: "Autenticação necessária." });
            }
            if (req.user.role !== "owner") {
                return res.status(403).json({ error: "Apenas o owner pode criar outro owner." });
            }
        }

        const { nome, email, password, telefone } = req.body;
        
        if (!nome || !email || !password || !telefone) {
            return res.status(400).json({ error: "Campos obrigatórios: nome, email, password, telefone" });
        }

        // Verificar se email já existe em User
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email já registrado em users" });
        }

        const hashedPassword = await bcrypt.hash(password.toString(), 10);

        // Criar em User
        const createdUser = await User.create({
            nome,
            email,
            password: hashedPassword,
            telefone,
            role: "owner",
        });

        // Criar em Owner
        const novoOwner = await OwnerController.create({
            nome,
            email,
            password: hashedPassword,
            telefone,
            role: "owner",
        });

        res.status(201).json({ 
            success: true,
            message: "Owner criado com sucesso",
            data: novoOwner 
        });

    } catch (err) {
        console.error("Erro ao criar owner:", err);
        // Limpar User se Owner falhou
        try {
            if (req.body && req.body.email) {
                await User.deleteOne({ email: req.body.email });
            }
        } catch (_) {}
        res.status(500).json({ error: "Erro ao criar owner" });
    }
});

// Buscar owner(s)
router.get("/get", authenticateToken, isOwner, async (req, res) => {
    try {
        const owners = await OwnerController.findAll();
        res.status(200).json({ 
            success: true,
            count: owners.length,
            data: owners 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao encontrar owner" });
    }
});

// Buscar owner por ID
router.get("/get/:id", authenticateToken, isOwner, async (req, res) => {
    try {
        const owner = await OwnerController.findById(req.params.id);
        if (!owner) {
            return res.status(404).json({ error: "Owner não encontrado" });
        }
        res.status(200).json({ 
            success: true,
            data: owner 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar owner" });
    }
});

// Atualizar owner
router.put("/update/:id", authenticateToken, isOwner, async (req, res) => {
    try {
        const { nome, telefone } = req.body;
        const updateData = {};
        
        if (nome) updateData.nome = nome;
        if (telefone) updateData.telefone = telefone;

        const ownerAtualizado = await OwnerController.update(req.params.id, updateData);
        
        if (!ownerAtualizado) {
            return res.status(404).json({ error: "Owner não encontrado" });
        }

        res.status(200).json({ 
            success: true,
            message: "Owner atualizado com sucesso",
            data: ownerAtualizado 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar owner" });
    }
});

// Deletar owner
router.delete("/delete/:id", authenticateToken, isOwner, async (req, res) => {
    try {
        const owner = await OwnerController.findById(req.params.id);
        if (!owner) {
            return res.status(404).json({ error: "Owner não encontrado" });
        }

        // Verificar se não é o único owner
        const allOwners = await OwnerController.findAll();
        if (allOwners.length <= 1) {
            return res.status(400).json({ error: "Não é possível deletar o único owner do sistema" });
        }

        // Deletar de Owner
        await OwnerController.removeById(req.params.id);

        // Deletar de User também
        await User.deleteOne({ email: owner.email });

        res.status(200).json({ 
            success: true,
            message: "Owner deletado com sucesso" 
        });
    } catch (err) {
        console.error("Erro ao deletar owner:", err);
        res.status(500).json({ error: "Erro ao eliminar owner" });
    }
});

module.exports = router;