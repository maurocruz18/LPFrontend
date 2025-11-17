const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, clientOnly } = require('../middleware/auth');
const { validateCartItem, validateWishlistItem, handleValidationErrors } = require('../middleware/validation');

// Todas as rotas são protegidas e requerem CLIENT autenticado
router.use(protect);
router.use(clientOnly);

// Biblioteca
router.get('/library', userController.getLibrary);

// Wishlist
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist', validateWishlistItem, handleValidationErrors, userController.addToWishlist);
router.delete('/wishlist/:gameId', userController.removeFromWishlist);

// Carrinho
router.get('/cart', userController.getCart);
router.post('/cart', validateCartItem, handleValidationErrors, userController.addToCart);
router.delete('/cart/:gameId', userController.removeFromCart);
router.delete('/cart', userController.clearCart);

module.exports = router;