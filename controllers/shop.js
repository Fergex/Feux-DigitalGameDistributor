const Game = require('../models/game');
const Cart = require('../models/cart');

exports.getGames = (req, res, next) => {
  Game.fetchAll(games => {
    res.render('shop/game-list', {
      games: games,
      pageTitle: 'All Games',
      path: '/games'
    });
  });
};

exports.getGame = (req, res, next) => {
  const gameId = req.params.gameId;
  Game.findById(gameId, game => {
    res.render('shop/game-detail', {
      game: game,
      pageTitle: game.title,
      path: '/games'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Game.fetchAll(games => {
    res.render('shop/index', {
      games: games,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Game.fetchAll(games => {
      const cartGames = [];
      for (game of games) {
        const cartGameData = cart.games.find(
          game => game.id === game.id
        );
        if (cartGameData) {
          cartGames.push({ gameData: game, qty: cartGameData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        games: cartGames
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const gameId = req.body.gameId;
  Game.findById(gameId, game => {
    Cart.addGame(gameId, game.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteGame = (req, res, next) => {
  const gameId = req.body.gameId;
  Game.findById(gameId, game => {
    Cart.deleteGame(gameId, game.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
