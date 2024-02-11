const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { saveReturnUrl } = require('../util/middleware.js');

// register user
router.get('/register', (req, res) =>  {
    res.render("users/register");
})

// create user 
// (not authenticating just logging in so use login method from passport)
router.post('/register', async(req, res) => {
    try {
    const { username, email, password } = req.body;
    const user = new User({email, username}); // passport adds username and passport
    const registeredUser = await User.register(user, password); // stores user and hashed password with salt
    req.login(registeredUser, (error) => {
        if (error) {
            return next(error)
        }
        req.flash('success', 'Welcome to Food Finder!');
        res.redirect('/restaurants');
    });

    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/register');
    }

});

router.get('/login', (req, res) => {
    res.render('users/login');
});



router.post('/login', saveReturnUrl, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.returnTo || '/restaurants');
});

router.get('/logout', (req, res) => {
    req.logout(function (error) {
        if (error) {
            next(error) // hit error handling middleware
        } else {
            req.flash('success', 'Signed Out');
            res.redirect('/restaurants');
        }
    });
});

module.exports = router;