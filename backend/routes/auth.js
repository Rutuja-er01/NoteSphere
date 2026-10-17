const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "myinotebooksecretkey";

// ROUTE 1: Create a new user
router.post('/createuser', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please enter all required fields.'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'A user with this email already exists.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: secPass
        });

        const data = {
            user: {
                id: user._id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error.message);

        return res.status(500).json({
            success: false,
            error: 'Internal server error. Please try again.'
        });
    }
});


// ROUTE 2: Login an existing user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please enter your email and password.'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email or password.'
            });
        }

        const passwordCompare = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCompare) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email or password.'
            });
        }

        const data = {
            user: {
                id: user._id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            success: false,
            error: 'Internal server error. Please try again.'
        });
    }
});

module.exports = router;