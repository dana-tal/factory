const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user using username and email. Any user returned from GET /users can log in with their credentials. The provided values are for convenience only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *           example:
 *             username: Antonette
 *             email: Shanna@melissa.tv
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post('/login', authController.login);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout"
 *     responses:
 *       200:
 *         description: Logged out
 *       500:
 *         description: Foiled to destroy session
 */
router.post('/logout',authController.logout);

module.exports = router;