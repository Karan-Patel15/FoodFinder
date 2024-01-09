const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// register user
router.get('/register', (req, res) =>  {
    res.render("users/register");
})

// create user
router.post('/register', async(req, res) => {
    try {
    const { username, email, password } = req.body;
    const user = new User({email, username}); // passport adds username and passport
    const registeredUser = await User.register(user, password); // stores user and hashed password with salt
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/register');
    }
    req.flash('success', 'Welcome to Food Finder!');
    res.redirect('/restaurants');

});

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/restaurants');
})  

module.exports = router;