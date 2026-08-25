const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const tokenBlacklistModel = require('../models/blacklist.model');

/**
 * @name registerUserController
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */

async function registerUser (req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide username, email, and password' 
            });
        }

        // Check if the user already exists
        const isUserAlreadyExists = await userModel.findOne({ $or: [{ username }, { email }] });
        if (isUserAlreadyExists) {
            /* User already exists */
            return res.status(400).json({ 
                message: 'Username or email already exists' 
            });
        }

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ 
            username, 
            email, 
            password: hashedPassword 
        });
        
        // const jti = crypto.randomUUID();

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username }, 
            process.env.JWT_SECRET, { expiresIn: '1d' }
        );

        res.cookie('token', token);
        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });

    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ 
            message: 'Server error',
        });
    }
}

/**
 * @name loginUserController
 * @desc Login a user
 * @route POST /api/auth/login
 * @access Public
 */

async function loginUser (req, res) {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Generate a token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token);
        res.status(200).json({ 
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ 
            message: 'Server error',
        });
    }
}

/**
 * @name logoutUserController
 * @desc Logout a user clearing the token cookie and adding the token to the blacklist
 * @route GET /api/auth/logout
 * @access Public
 */
async function logoutUser (req, res) {
    try{
        const token = req.cookies.token;
        if (token) {
            await tokenBlacklistModel.create({ token });
        }
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    }catch(error){
        console.error('Error logging out user:', error);
        res.status(500).json({
            message: 'Server error',
        });
    }
}

async function getMe(req, res) {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ 
            message: 'User information retrieved successfully',
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
}

