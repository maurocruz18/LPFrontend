const User = require('../models/user');
const Game = require('../models/Game');

// Simular compra de jogo individual
exports.purchaseGame = async (req, res) => {
  try {
    const gameId = parseInt(req.params.gameId);
    const { paymentMethod } = req.body;
    const user = await User.findById(req.user.id);

    // Verificar se já possui o jogo
    const ownsGame = user.library.some(item => item.gameId === gameId);
    if (ownsGame) {
      return res.status(400).json({
        success: false,
        message: 'Já possui este jogo'
      });
    }

    // Buscar informações do jogo
    const game = await Game.findOne({ rawgId: gameId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jogo não encontrado'
      });
    }

    const price = game.price.onSale ? game.price.salePrice : game.price.amount;

    // Adicionar à biblioteca
    user.library.push({
      gameId: gameId,
      gameName: game.name,
      purchasePrice: price,
      purchaseDate: Date.now()
    });

    // Remover do carrinho se estiver lá
    user.cart = user.cart.filter(item => item.gameId !== gameId);

    // Remover da wishlist se estiver lá
    user.wishlist = user.wishlist.filter(item => item.gameId !== gameId);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Compra realizada com sucesso',
      data: {
        game: {
          id: gameId,
          name: game.name,
          price: price
        },
        paymentMethod,
        purchaseDate: Date.now()
      }
    });
  } catch (error) {
    console.error('Erro na compra:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar compra',
      error: error.message
    });
  }
};

// Checkout do carrinho completo
exports.checkoutCart = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const user = await User.findById(req.user.id);

    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Carrinho vazio'
      });
    }

    const purchasedGames = [];
    let totalPrice = 0;

    // Processar cada jogo do carrinho
    for (const cartItem of user.cart) {
      // Verificar se já possui
      const ownsGame = user.library.some(item => item.gameId === cartItem.gameId);
      if (!ownsGame) {
        user.library.push({
          gameId: cartItem.gameId,
          gameName: cartItem.gameName,
          purchasePrice: cartItem.price,
          purchaseDate: Date.now()
        });

        purchasedGames.push({
          id: cartItem.gameId,
          name: cartItem.gameName,
          price: cartItem.price
        });

        totalPrice += cartItem.price || 0;

        // Remover da wishlist se estiver lá
        user.wishlist = user.wishlist.filter(item => item.gameId !== cartItem.gameId);
      }
    }

    // Limpar carrinho
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: `Compra de ${purchasedGames.length} jogo(s) realizada com sucesso`,
      data: {
        games: purchasedGames,
        totalPrice,
        paymentMethod,
        purchaseDate: Date.now()
      }
    });
  } catch (error) {
    console.error('Erro no checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar checkout',
      error: error.message
    });
  }
};

// Histórico de transações (simulado pela biblioteca)
exports.getTransactionHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Ordenar por data de compra
    const sortedLibrary = user.library.sort((a, b) => 
      new Date(b.purchaseDate) - new Date(a.purchaseDate)
    );

    res.status(200).json({
      success: true,
      count: sortedLibrary.length,
      data: sortedLibrary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter histórico',
      error: error.message
    });
  }
};

// Obter detalhes de uma transação específica
exports.getTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const user = await User.findById(req.user.id);
    
    const transaction = user.library.id(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter transação',
      error: error.message
    });
  }
};