const User = require('../models/user');
const Game = require('../models/Game');

// Obter biblioteca do utilizador
exports.getLibrary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      count: user.library.length,
      data: user.library
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter biblioteca',
      error: error.message
    });
  }
};

// Obter wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter wishlist',
      error: error.message
    });
  }
};

// Adicionar à wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { gameId, gameName } = req.body;
    const user = await User.findById(req.user.id);

    // Verificar se já está na wishlist
    const alreadyInWishlist = user.wishlist.some(item => item.gameId === gameId);
    if (alreadyInWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Jogo já está na wishlist'
      });
    }

    // Verificar se já possui o jogo
    const ownsGame = user.library.some(item => item.gameId === gameId);
    if (ownsGame) {
      return res.status(400).json({
        success: false,
        message: 'Já possui este jogo'
      });
    }

    user.wishlist.push({ gameId, gameName });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Jogo adicionado à wishlist',
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar à wishlist',
      error: error.message
    });
  }
};

// Remover da wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { gameId } = req.params;
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(item => item.gameId !== parseInt(gameId));
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Jogo removido da wishlist',
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao remover da wishlist',
      error: error.message
    });
  }
};

// Obter carrinho
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const totalPrice = user.cart.reduce((sum, item) => sum + (item.price || 0), 0);

    res.status(200).json({
      success: true,
      count: user.cart.length,
      totalPrice,
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter carrinho',
      error: error.message
    });
  }
};

// Adicionar ao carrinho
exports.addToCart = async (req, res) => {
  try {
    const { gameId, gameName, price } = req.body;
    const user = await User.findById(req.user.id);

    // Verificar se já possui o jogo
    const ownsGame = user.library.some(item => item.gameId === gameId);
    if (ownsGame) {
      return res.status(400).json({
        success: false,
        message: 'Já possui este jogo'
      });
    }

    // Verificar se já está no carrinho
    const alreadyInCart = user.cart.some(item => item.gameId === gameId);
    if (alreadyInCart) {
      return res.status(400).json({
        success: false,
        message: 'Jogo já está no carrinho'
      });
    }

    user.cart.push({ gameId, gameName, price });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Jogo adicionado ao carrinho',
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar ao carrinho',
      error: error.message
    });
  }
};

// Remover do carrinho
exports.removeFromCart = async (req, res) => {
  try {
    const { gameId } = req.params;
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(item => item.gameId !== parseInt(gameId));
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Jogo removido do carrinho',
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao remover do carrinho',
      error: error.message
    });
  }
};

// Limpar carrinho
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Carrinho limpo',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao limpar carrinho',
      error: error.message
    });
  }
};