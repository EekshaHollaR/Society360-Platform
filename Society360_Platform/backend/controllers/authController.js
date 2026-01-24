const User = require('../models/userModel');
const { hashPassword, comparePassword, generateToken } = require('../utils/security');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (for now, or Admin only later)
const registerUser = async (req, res) => {
    // Input validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, password, role, phone_number } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role, // Optional, defaults to 'Resident' in model if null
            phone_number
        });

        if (newUser) {
            res.status(201).json({
                model: newUser,
                token: generateToken(newUser.id, newUser.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check for user email
        const user = await User.findByEmail(email);

        if (user && (await comparePassword(password, user.password_hash))) {
            res.json({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const Unit = require('../models/unitModel');

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    if (req.user) {
        try {
            const units = await Unit.findUnitsByUser(req.user.id);
            // Convert to plain object to avoid mutation issues if req.user is a mongoose doc (though here it seems to be from middleware which might be plain or not)
            // Assuming req.user is the user object.
            // If req.user is from JWT payload, it might be minimal. If from DB in middleware, it's full.
            // Middleware usually fetches full user.
            const userResponse = { ...req.user, units };
            res.json(userResponse);
        } catch (error) {
            console.error('Error fetching user units:', error);
            res.status(500).json({ message: 'Server error fetching user details' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
