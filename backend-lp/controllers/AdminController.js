const Admin = require('../models/admin');

// Criar admin
function create(values) {
    const newAdmin = new Admin(values);
    return newAdmin.save();
}

// Buscar todos os admins
function findAll() {
    return Admin.find({});
}

// Buscar admin por ID
function findById(id) {
    return Admin.findById(id);
}

// Buscar admin por email
function findByEmail(email) {
    return Admin.findOne({ email });
}

// Atualizar admin
function update(id, values) {
    return Admin.findByIdAndUpdate(id, values, { new: true });
}

// Remover admin por ID
function removeById(id) {
    return Admin.findByIdAndDelete(id);
}

module.exports = {
    create,
    findAll,
    findById,
    findByEmail,
    update,
    removeById
};