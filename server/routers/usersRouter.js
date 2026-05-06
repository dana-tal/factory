
const usersController = require('../controllers/usersController');
const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users. Any user listed here can log in to the factory API using their username and email.
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Server error
 */
router.get('/', usersController.getAllUsers);

module.exports = router;