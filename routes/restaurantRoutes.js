const express = require('express');
const router = express.Router()

const wrapAsync = require('../util/wrapAsync');
const ExpressError = require("../util/ExpressError.js");
const Restaurant = require("../models/restaurant");
const Joi = require('joi');
const { isLoggedIn, isAuthor, validateRestaurant } = require('../util/middleware.js');



//index page show all restaurants
router.get("/", wrapAsync(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render("restaurants/index", { restaurants });
}));

//render new entry form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("restaurants/new");
})

//create restaurant
router.post("/", isLoggedIn, validateRestaurant, wrapAsync(async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'Successfully made a new restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`);
}));

//show entry
router.get("/:id", wrapAsync(async (req, res) => {
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        res.redirect("/restaurants");
    }
    res.render("restaurants/show", { restaurant });
}));

//render edit form
router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        res.redirect("/restaurants");
    }
    res.render("restaurants/edit", { restaurant });
}));

//update restaurant
router.put("/:id", isLoggedIn, isAuthor, validateRestaurant, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndUpdate(id, req.body.restaurant, { runValidators: true });
    req.flash('success', 'Successfully updated restaurant!');
    res.redirect(`/restaurants/${id}`);
}));

//DELETE restaurant
router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted restaurant!');
    res.redirect("/restaurants");
}));

module.exports = router;