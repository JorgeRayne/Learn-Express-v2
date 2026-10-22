import express from 'express';
import User from '../models/user.model.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

const user = express.Router()

//Register From
user.get('/register', (req, res) => {
    res.render('register');
})


user.post('/register', [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Please enter a valid email'),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),

    body('password2')
        .notEmpty()
        .withMessage('Please confirm your password')
        .bail()
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage('Passwords do not match')
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('register', {
            errors: errors.array()
        });
    }

    try {
        const { name, email, username, password } = req.body;

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hash
        });

        // Wait for the database operation to complete
        await newUser.save();

        req.flash(
            'success',
            'You are now registered and can log in'
        );

        return res.redirect('/user/login');

    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).render('register', {
            errors: [{
                msg: 'Registration failed. Please try again.'
            }]
        });
    }
});



user.get('/login', (req, res) => {
    res.render('login');
})

export default user;