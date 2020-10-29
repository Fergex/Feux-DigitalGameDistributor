const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-game => GET
router.get('/add-game', adminController.getAddGame);

// /admin/games => GET
router.get('/games', adminController.getGames);

// /admin/add-game => POST
router.post('/add-game', adminController.postAddGame);

router.get('/edit-game/:gameId', adminController.getEditGame);

router.post('/edit-game', adminController.postEditGame);

router.post('/delete-game', adminController.postDeleteGame);

module.exports = router;
