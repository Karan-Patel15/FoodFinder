const express = require('express');
const router = express.Router({mergeParams: true});
const ExpressError = require("../util/ExpressError.js");

const {validateReview, isLoggedIn, isReviewAuthor} = require('../util/middleware.js');
const reviewController = require('../controllers/reviewController.js');


//CREATE review
router.post("/", isLoggedIn, validateReview, reviewController.createReview);

// DELETE review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewController.deleteReview);

router.all("*", (req, res) => {
    throw new ExpressError("Page Not Found", 404);
});

module.exports = router;