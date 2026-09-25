const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "myinotebooksecretkey";


// ROUTE 1: Create a user
router.post('/createuser', async (req, res) => {

    try {

        // Check whether user already exists
        let user = await User.findOne({
            email: req.body.email
        });

        if (user) {
            return res.status(400).json({
                error: "Sorry, a user with this email already exists"
            });
        }


        // Generate salt
        const salt = await bcrypt.genSalt(10);


        // Hash password
        const secPass = await bcrypt.hash(
            req.body.password,
            salt
        );


        // Create user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });


        // Send response
        res.json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }

});
// ROUTE 2: Login user
router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user by email
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: "Please try to login with correct credentials"
            });
        }

        // Compare password
        const passwordCompare = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCompare) {
            return res.status(400).json({
                error: "Please try to login with correct credentials"
            });
        }

        // Create JWT data
        const data = {
            user: {
                id: user._id
            }
        };

        // Generate JWT token
        const authToken = jwt.sign(data, JWT_SECRET);

        // Send response
        res.json({
            message: "Login successful",
            authToken: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }

});


module.exports = router;