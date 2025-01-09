const Restaurant = require("../models/restaurant.js");
const Review = require("../models/review.js");
const { restaurantSchema, reviewSchema } = require('../backendValidation/schemas.js');
const ExpressError = require("./ExpressError.js");

const validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const message = error.details.map(element => element.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(element => element.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}


const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in');
        req.session.returnTo = req.originalUrl;
        return res.redirect("/login");
    }
    next();
}

const saveReturnUrl = (req, res, next) => {
    res.locals.returnTo = req.session.returnTo;
    next();
}

const isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id)
    if (!restaurant.author.equals(req.user._id)) { // MUST USE req.user._id NOT currentUser._id  BECAUSE currentUser not set until after middleware
        req.flash('error', 'Permission Denied');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
}

const isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Permission Denied');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
}
module.exports = {isLoggedIn, saveReturnUrl, isAuthor, validateRestaurant, validateReview, isReviewAuthor};