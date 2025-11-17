const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, 
    titulo: { type: String, required: true },
    mensagem: { type: String, required: true },
    tipo: { type: String, enum: ['servico', 'lembrete', 'promocao'], required: true }, 
    dataEnvio: { type: Date, default: Date.now },
    visto: { type: Boolean, default: false }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;