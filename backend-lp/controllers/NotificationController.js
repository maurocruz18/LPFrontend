const Notification = require('../models/notification');

const NotificationController = {
    criarNotificacao: async (clienteId, titulo, mensagem, tipo) => {
        try {
            const notificacao = new Notification({
                cliente: clienteId,
                titulo,
                mensagem,
                tipo
            });
            return await notificacao.save();
        } catch (err) {
            throw new Error('Erro ao criar notificação: ' + err.message);
        }
    },

    obterNotificacoesPorCliente: async (clienteId) => {
        try {
            return await Notification.find({ cliente: clienteId }).sort({ dataEnvio: -1 });
        } catch (err) {
            throw new Error('Erro ao buscar notificações: ' + err.message);
        }
    },
    obterPromocoes: async () => {
        try {
            return await Notification.find({ tipo: "promocao" }).sort({ dataEnvio: -1 });
        } catch (err) {
            throw new Error('Erro ao buscar promoções: ' + err.message);
        }
    },
    
};

module.exports = NotificationController;