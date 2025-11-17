const Client = require('../models/client');

// Criar cliente
function create(values) {
    const newClient = new Client(values);
    return newClient.save();
}

// Buscar todos os clientes
function findAll() {
    return Client.find({}).populate('user');
}

// Buscar cliente por ID
function findById(id) {
    return Client.findById(id).populate('user');
}

// Buscar cliente por user ID
function findByUserId(userId) {
    return Client.findOne({ user: userId }).populate('user');
}

// Atualizar cliente
function update(id, values) {
    return Client.findByIdAndUpdate(id, values, { new: true });
}

// Remover cliente por ID
function removeById(id) {
    return Client.findByIdAndDelete(id);
}

module.exports = {
    create,
    findAll,
    findById,
    findByUserId,
    update,
    removeById
};