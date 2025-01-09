const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveReturnUrl } = require('../util/middleware.js');
const authController = require('../controllers/authController.js');

router.route("/register")
    .get(authController.renderRegisterForm)
    // create user 
    // (not authenticating just logging in so use login method from passport)
    .post(authController.registerUser);

router.route("/login")
    .get(authController.renderLogInForm)
    .post(saveReturnUrl, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), authController.logIn);

router.get('/logout', authController.logOut);

module.exports = router;