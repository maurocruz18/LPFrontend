const Owner = require('../models/owner');

// Criar owner
function create(values) {
    const newOwner = new Owner(values);
    return newOwner.save();
}

// Buscar todos os owners
function findAll() {
    return Owner.find({});
}

// Buscar owner por ID
function findById(id) {
    return Owner.findById(id);
}

// Buscar owner por email
function findByEmail(email) {
    return Owner.findOne({ email });
}

// Atualizar owner
function update(id, values) {
    return Owner.findByIdAndUpdate(id, values, { new: true });
}

// Remover owner por ID
function removeById(id) {
    return Owner.findByIdAndDelete(id);
}

module.exports = {
    create,
    findAll,
    findById,
    findByEmail,
    update,
    removeById
};