const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { protect, optionalAuth, clientOnly } = require('../middleware/auth');
const { 
  validateGameId, 
  validateGameRating, 
  validateSearch,
  handleValidationErrors 
} = require('../middleware/validation');

// Rotas públicas (Guest ou Client podem acessar)
router.get('/homepage', optionalAuth, gameController.getHomepage);
router.get('/search', optionalAuth, validateSearch, handleValidationErrors, gameController.searchGames);
router.get('/:gameId', optionalAuth, validateGameId, handleValidationErrors, gameController.getGameDetails);
router.get('/:gameId/ratings', optionalAuth, validateGameId, handleValidationErrors, gameController.getGameRatings);

// Rotas protegidas (apenas Client autenticado)
router.post('/:gameId/rating', protect, clientOnly, validateGameId, validateGameRating, handleValidationErrors, gameController.addGameRating);

module.exports = router;