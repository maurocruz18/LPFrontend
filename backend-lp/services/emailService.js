require("dotenv").config();
const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "8240579@estg.ipp.pt",  
    pass: "tmqdlvhdfcxcfnqn"      
  }
});

// Verificar conexão
transporter.verify((error, success) => {
  if (error) {
    console.error(" Erro SMTP:", error);
  } else {
    console.log(" Servidor de e-mail pronto!");
  }
});

async function sendWelcome(email, nome) {
  try {
    const info = await transporter.sendMail({
      from: '"Equipa LP Games" <8240579@estg.ipp.pt>', 
      subject: `Bem-vindo(a), ${nome}! 🎮`,
      html: `
        <h2>Olá ${nome}!</h2>
        <p>Bem-vindo(a) à LP Games! A tua conta foi criada com sucesso.</p>
        <p>Explora, descobre e diverte-te com os melhores jogos!</p>
        <hr>
        <small>© LP Games ${new Date().getFullYear()}</small>
      `
    });
    console.log(" E-mail enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw error;
  }
}

async function sendRecupPassword(email, token) {
  try {
    const info = await transporter.sendMail({
      from: '"Equipa LP Games" <8240579@estg.ipp.pt>', 
      subject: "Recuperação de senha ",
      html: `
        <h2>Recuperação de Senha</h2>
        <p>Recebemos um pedido para redefinir a tua palavra-passe.</p>
        <p><a href="http://localhost:4200/reset-password/${token}" 
              style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                     text-decoration: none; border-radius: 5px; display: inline-block;">
          Redefinir Senha
        </a></p>
        <p><small>Link válido por 1 hora.</small></p>
        <p>Se não fizeste este pedido, ignora este e-mail.</p>
        <hr>
        <small>© LP Games ${new Date().getFullYear()}</small>
      `
    });
    console.log(" E-mail de recuperação enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error(" Erro ao enviar e-mail de recuperação:", error);
    throw error;
  }
}

async function sendPromotion(email, titulo, descricao) {
  try {
    const info = await transporter.sendMail({
      from: '"LP Games - Promoções" <8240579@estg.ipp.pt>', 
      to: email,
      subject: ` ${titulo}`,
      html: `
        <h2>${titulo}</h2>
        <p>${descricao}</p>
        <p><a href="http://localhost:4200/promocoes" 
              style="background-color: #FF5722; color: white; padding: 10px 20px; 
                     text-decoration: none; border-radius: 5px; display: inline-block;">
          Ver Promoções
        </a></p>
        <hr>
        <small>Estás a receber este e-mail porque subscreveste as promoções LP Games.</small>
      `
    });
    console.log(" E-mail promocional enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error(" Erro ao enviar e-mail promocional:", error);
    throw error;
  }
}

module.exports = {
  sendWelcome,
  sendRecupPassword,
  sendPromotion
};