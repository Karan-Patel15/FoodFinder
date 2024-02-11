const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../util/wrapAsync.js');
const ExpressError = require("../util/ExpressError.js");
const Review = require("../models/review.js");
const Restaurant = require("../models/restaurant.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../util/middleware.js');





//CREATE review
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/restaurants/${id}`)
}));

// DELETE review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/restaurants/${id}`);

}));

router.all("*", (req, res) => {
    throw new ExpressError("Page Not Found", 404);
});

module.exports = router;