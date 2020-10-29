const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addGame(id, gamePrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { games: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing game
      const existingGameIndex = cart.games.findIndex(
        game => game.id === id
      );
      const existingGame = cart.games[existingGameIndex];
      let updatedGame;
      // Add new game/ increase quantity
      if (existingGame) {
        updatedGame = { ...existingGame };
        updatedGame.qty = updatedGame.qty + 1;
        cart.games = [...cart.games];
        cart.games[existingGameIndex] = updatedGame;
      } else {
        updatedGame = { id: id, qty: 1 };
        cart.games = [...cart.games, updatedGame];
      }
      cart.totalPrice = cart.totalPrice + +gamePrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteGame(id, gamePrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const game = updatedCart.games.find(game => game.id === id);
      if(!game) {
        return;
      }
      const gameQty = game.qty;
      updatedCart.games = updatedCart.games.filter(
        game => game.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - gamePrice * gameQty;

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
