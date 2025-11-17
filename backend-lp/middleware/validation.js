const { body, param, query, validationResult } = require('express-validator');

// Middleware para tratar erros de validação
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Validação de Game ID
exports.validateGameId = [
  param('gameId')
    .isInt({ min: 1 })
    .withMessage('ID do jogo deve ser um número inteiro positivo')
];

// Validação de rating de jogo
exports.validateGameRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating deve ser entre 1 e 5'),
  body('comment')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Comentário não pode exceder 1000 caracteres')
];

// Validação de pesquisa
exports.validateSearch = [
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de pesquisa inválido'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Número de página inválido'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve estar entre 1 e 100')
];

// Validação de item no carrinho
exports.validateCartItem = [
  body('gameId')
    .isInt({ min: 1 })
    .withMessage('ID do jogo inválido'),
  body('gameName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Nome do jogo é obrigatório'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo')
];

// Validação de wishlist item
exports.validateWishlistItem = [
  body('gameId')
    .isInt({ min: 1 })
    .withMessage('ID do jogo inválido'),
  body('gameName')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Nome do jogo é obrigatório')
];