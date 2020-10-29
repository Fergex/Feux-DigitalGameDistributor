const Game = require('../models/game');

exports.getAddGame = (req, res, next) => {
  res.render('admin/edit-game', {
    pageTitle: 'Add Game',
    path: '/admin/add-game',
    editing: false
  });
};

exports.postAddGame = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const game = new Game(null, title, imageUrl, description, price);
  game.save();
  res.redirect('/');
};

exports.getEditGame = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const gameId = req.params.gameId;
  Game.findById(gameId, game => {
    if (!game) {
      return res.redirect('/');
    }
    res.render('admin/edit-game', {
      pageTitle: 'Edit Game',
      path: '/admin/edit-game',
      editing: editMode,
      game: game
    });
  });
};

exports.postEditGame = (req, res, next) => {
  const gameId = req.body.gameId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedGame = new Game(
    gameId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedGame.save();
  res.redirect('/admin/games');
};

exports.getGames = (req, res, next) => {
  Game.fetchAll(games => {
    res.render('admin/games', {
      games: games,
      pageTitle: 'Admin Games',
      path: '/admin/games'
    });
  });
};

exports.postDeleteGame = (req, res, next) => {
  const gameId = req.body.gameId;
  Game.deleteById(gameId);
  res.redirect('/admin/games');
};
