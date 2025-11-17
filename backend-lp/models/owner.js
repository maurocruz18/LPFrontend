const mongoose = require('mongoose');


const ownerSchema = new mongoose.Schema({ 
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    telefone: { type: Number, required: true },
    role: { type: String, default: 'owner' },
});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;