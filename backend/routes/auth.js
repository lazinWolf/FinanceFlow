// routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Get JWT secret key from environment variable
const JWT_SECRET = process.env.JWT_SECRET; 

// Signup route
router.post('/signup', async (req, res) => {
    const { fullName, email, phone, password } = req.body;

    console.log("Signup request received:", req.body); 

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email); 
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user 
        const newUser = new User({ fullName, email, phone, password }); 
        await newUser.save();

        console.log("New user created:", newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error during signup:", error); 
        res.status(500).json({ message: 'Failed to register user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("Login request received:", req.body);

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(401).json({ message: 'Invalid email or password' }); 
        }

        console.log("User found:", user);

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log("Incorrect password for user:", email);
            return res.status(401).json({ message: 'Invalid email or password' }); 
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 

        res.status(200).json({ message: 'Login successful', token }); 
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Failed to login' }); 
    }
});

module.exports = router;