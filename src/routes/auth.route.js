const {Router} = require('express');
const authRouter = Router();
const {registerUser, loginUser, logoutUser, getMe} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

authRouter.post('/register', registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user with email and password
 * @access Public
 */
authRouter.post('/login', loginUser);

/**
 * @route GET /api/auth/logout
 * @desc clear the token cookie and add the token to the blacklist
 * @access Public
 */
authRouter.get('/logout', logoutUser);

/**
 * @route GET /api/auth/get-me
 * @desc Get the current user's information
 * @access Private
 */
authRouter.get('/get-me', authMiddleware.authUser, getMe);

module.exports = authRouter;