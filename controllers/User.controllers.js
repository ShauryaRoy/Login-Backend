const User = require('../models/User.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateRefreshToken = (userId) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || '7d';

    return jwt.sign({ userId }, secret, { expiresIn });
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Error registering user" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
        });

        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json({ message: 'Login successful', token: refreshToken }); // Sending token in response for testing
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'Error during login' });
    }
};
const logout = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.refreshToken = null;
        await user.save();

        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: 'Error during logout' });
    }
};

module.exports = {
    register,
    login,
    logout
};
