
const usersController = require('../controllers/usersController');
const express = require('express');

const router = express.Router();


router.get('/', usersController.getAllUsers);

module.exports = router;