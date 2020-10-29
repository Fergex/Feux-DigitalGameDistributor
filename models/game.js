const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'games.json'
);

const getGamesFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Game {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getGamesFromFile(games => {
      if (this.id) {
        const existingGameIndex = games.findIndex(
          game => game.id === this.id
        );
        const updatedGames = [...games];
        updatedGames[existingGameIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedGames), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        games.push(this);
        fs.writeFile(p, JSON.stringify(games), err => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getGamesFromFile(games => {
      const game = games.find(game => game.id === id);
      const updatedGames = games.filter(game => game.id !== id);
      fs.writeFile(p, JSON.stringify(updatedGames), err => {
        if (!err) {
          Cart.deleteGame(id, game.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getGamesFromFile(cb);
  }

  static findById(id, cb) {
    getGamesFromFile(games => {
      const game = games.find(p => p.id === id);
      cb(game);
    });
  }
};
