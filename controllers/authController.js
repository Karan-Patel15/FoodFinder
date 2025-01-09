const { render } = require('express/lib/response.js');
const User = require('../models/user');
const wrapAsync = require('../util/wrapAsync.js');


renderRegisterForm = (req, res) =>  {
    res.render("users/register");
};

registerUser = async(req, res) => {
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

};

renderLogInForm = (req, res) => {
    res.render('users/login');
}

logIn = (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.returnTo || '/restaurants');
};

logOut = (req, res) => {
    req.logout(function (error) {
        if (error) {
            next(error) // hit error handling middleware
        } else {
            req.flash('success', 'Signed Out');
            res.redirect('/restaurants');
        }
    });
}

module.exports = {renderRegisterForm, registerUser, renderLogInForm, logIn, logOut}