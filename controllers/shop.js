const Game = require('../models/game');

exports.getGames = (req, res, next) => {
  Game.findAll()
    .then(games => {
      res.render('shop/game-list', {
        games: games,
        pageTitle: 'All Games',
        path: '/games'
      });
    })
    .catch(err => console.log(err));
};

exports.getGame = (req, res, next) => {
  const gameId = req.params.gameId;
  Game.findAll({where: { id: gameId } })
  .then(games => {
    res.render('shop/game-detail', {
      game: games[0],
      pageTitle: games[0].title,
      path: '/games'
    });
  })
  .catch(err => console.log(err));
  // Game.findByPk(gameId)
  // .then(game => {
  //     res.render('shop/game-detail', {
  //       game: game,
  //       pageTitle: game.title,
  //       path: '/games'
  //     });
  //   })
  // .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Game.findAll().then(games => {
    res.render('shop/index', {
      games: games,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log(err);
  });
}

exports.getCart = (req, res, next) => {-
  req.user
    .getCart()
    .then(cart => {
      return cart
    .getGames()
    .then(games => {
      res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              games: games
            });
    })
    .catch(err => {
      console.log(err);
      })
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const gameId = req.body.gameId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getGames({where : {id: gameId } });
    })
    .then(games => {
      let game;
      if(games.length > 0) {
        game = games[0]
      }
      if(game) {
        const oldQuantity = game.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return game;
      }
      return Game.findByPk(gameId)
    })
    .then(game => {
      return fetchedCart.addGame(game, { 
        through: { quantity: newQuantity}
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postCartDeleteGame = (req, res, next) => {
  const gameId = req.body.gameId;
  req.user.getCart()
  .then(cart => {
    return cart.getGames({where: { id: gameId} })
  })
  .then(games => {
    const game = games[0];
    return game.cartItem.destroy();
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
  .getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getGames();
  })
  .then(games => {
    return req.user
      .createOrder()
      .then(order => {
        order.addGames(games.map(game => {
          game.orderItem = {quantity: game.cartItem.quantity};
          return game;
        }));
      })
  })
  .then(result => {
    return fetchedCart.setGames(null);
  })
  .then(result => {
    res.redirect('/orders');
  })
  .catch(err => {
    console.log(err);
  })
};


exports.getOrders = (req, res, next) => {
  req.user
  .getOrders({include: ['games']})
    .then(orders => {
      console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      console.log(err);
    })
};