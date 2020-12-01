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
  req.user
  .createGame({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
  .then(result => {
    //console.log(result);
    console.log('Added Game to library')
    res.redirect('/admin/games');
  })
  .catch(err => {
    console.log(err);
  });
}

exports.getEditGame = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const gameId = req.params.gameId;
  req.user
  .getGames({where: {id: gameId } })
  //Game.findByPk(gameId)
  .then(games => {
    const game = games[0];
    if (!game) {
      return res.redirect('/');
    }
    res.render('admin/edit-game', {
      pageTitle: 'Edit Game',
      path: '/admin/edit-game',
      editing: editMode,
      game: game
    });
  })
  .catch(err => console.log(err)); 
};

exports.postEditGame = (req, res, next) => {
  const gameId = req.body.gameId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Game.findByPk(gameId)
    .then(game => { 
      game.title = updatedTitle;
      game.price = updatedPrice;
      game.description = updatedDesc;
      game.imageUrl = updatedImageUrl;
      return game.save();
  })
  .then(result => {
    console.log('UPDATED GAME');
    res.redirect('/admin/games');
  })
  .catch(err => console.log(err));
};

exports.getGames = (req, res, next) => {
  req.user
    .getGames()
    .then(games => {
      res.render('admin/games', {
        games: games,
        pageTitle: 'Admin Games',
        path: '/admin/games'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteGame = (req, res, next) => {
  const gameId = req.body.gameId;
  Game.findByPk(gameId)
  .then(game => {
    return game.destroy();
  })
  .then(result => {
    console.log('DESTROYED GAME');
    res.redirect('/admin/games');
  })
  .catch(err => console.log(err));
};
