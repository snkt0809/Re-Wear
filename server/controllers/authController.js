const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// @desc    Register new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already in use' });

        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            points: user.points,
            token: generateToken(user),
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            points: user.points,
            token: generateToken(user),
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }

};

exports.getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            points: req.user.points,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
