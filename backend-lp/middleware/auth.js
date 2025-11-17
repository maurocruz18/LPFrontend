const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Verificar token (usado em rotas antigas)
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }
        req.user = user;
        next();
    });
};

// Verificar se está autenticado (obrigatório) - novo formato
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado. Por favor, faça login para continuar.',
        requiresAuth: true
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta');
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilizador não encontrado.',
          requiresAuth: true
        });
      }

      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Conta desativada. Contacte o suporte.'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado. Por favor, faça login novamente.',
        requiresAuth: true
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: error.message
    });
  }
};

// Autenticação opcional - permite guest e authenticated users
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Se não houver token, continua como GUEST
    if (!token) {
      req.user = null;
      req.isGuest = true;
      return next();
    }

    // Se houver token, tenta validar
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta');
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || !req.user.isActive) {
        req.user = null;
        req.isGuest = true;
      } else {
        req.isGuest = false;
      }
      
      next();
    } catch (error) {
      // Token inválido - continua como guest
      req.user = null;
      req.isGuest = true;
      next();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: error.message
    });
  }
};

// Verificar se é admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas admins podem acessar.' });
    }
    next();
};

// Verificar se é client
const isClient = (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ error: 'Acesso negado. Apenas clientes podem acessar.' });
    }
    next();
};

// Verificar se é owner
const isOwner = (req, res, next) => {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ error: 'Acesso negado. Apenas o owner pode acessar.' });
    }
    next();
};

// Verificar se é admin ou owner
const isAdminOrOwner = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
        return res.status(403).json({ error: 'Acesso negado. Apenas admins ou owner podem acessar.' });
    }
    next();
};

// Verificar se é admin ou client
const isAdminOrClient = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'client') {
        return res.status(403).json({ error: 'Acesso negado.' });
    }
    next();
};

// Middleware para verificar se é cliente (não permite guests)
exports.clientOnly = (req, res, next) => {
  if (req.isGuest || !req.user) {
    return res.status(401).json({
      success: false,
      message: 'Necessário fazer login para realizar esta ação.',
      requiresAuth: true,
      action: 'login_required'
    });
  }
  
  if (req.user.role !== 'client') {
    return res.status(403).json({
      success: false,
      message: 'Apenas clientes podem realizar esta ação.'
    });
  }
  
  next();
};

// Verificar roles específicos
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' não tem permissão para aceder a este recurso.`
      });
    }
    next();
  };
};

module.exports = {
    authenticateToken,
    isAdmin,
    isClient,
    isOwner,
    isAdminOrOwner,
    isAdminOrClient,
    protect: exports.protect,
    optionalAuth: exports.optionalAuth,
    clientOnly: exports.clientOnly,
    authorize: exports.authorize
};