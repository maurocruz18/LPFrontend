const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/ClientController");
const AdminController = require("../controllers/AdminController");
const Admin = require("../models/admin");
const User = require("../models/client");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// login
router.post("/", async (req, res) => {

    try {
        const {email, password } = req.body;      
        
        const user = await User.findOne({ email })
            if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
            }

            // Suport to unhashed passwords for legacy users
            const isBcryptHash = typeof user.password === 'string' && user.password.startsWith('$2');
            let senhaCorreta = false;
            if (isBcryptHash) {
                senhaCorreta = await bcrypt.compare(password, user.password);
            } else {
                senhaCorreta = password === user.password;
                if (senhaCorreta) {
                    const newHashed = await bcrypt.hash(password, 10);
                    user.password = newHashed;
                    try { await user.save(); } catch (_) { /* best-effort */ }
                }
            }

            if (!senhaCorreta) {
                return res.status(401).json({ error: "Credenciais inválidas" });
            }
            
            const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            'chave-secreta',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login bem-sucedido", token, user });
    }
    
    catch (err) {
        res.status(500).json({ error: "Erro ao fazer login" });
    }
});

module.exports = router;