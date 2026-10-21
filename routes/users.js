import express from 'express';
import User from '../models/user.model.js';
import { body, validationResult } from 'express-validator';

const user = express.Router()

//Register From
user.get('/register', (req, res) => {
    res.render('register');
})

user.post('/register',[
    body('name')
        .notEmpty()
        .withMessage('Name is Required'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('username')
        .notEmpty()
        .withMessage('Username is Required'),
    body('password')
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

    try {
        if(!errors.isEmpty()){
            return res.render('register', {
                errors: errors.array()
            });
        }
    
        const {name, email, username, password, password2} = req.body;

        if(password != password2){
            return res.render('register', {
                errors: errors.array()
            })
        }

        const newUser = new User({
            name,
            email,
            username,
            password,
            password2
        })
        
        newUser.save();
        res.redirect('/');
        
    } catch (error) {
        res.render('register', {
            errors: error
        })
    }
})

export default user;