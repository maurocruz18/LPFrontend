const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({ 
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    telefone: { type: Number, required: true },
    role: { type: String, default: 'admin' },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;