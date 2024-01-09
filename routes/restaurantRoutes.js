const express = require('express');
const router = express.Router()

const wrapAsync = require('../util/wrapAsync');
const ExpressError = require("../util/ExpressError.js");
const Restaurant = require("../models/restaurant");
const Joi = require('joi');
const { restaurantSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware.js');


const validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const message = error.details.map(element => element.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

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
router.post("/", validateRestaurant, wrapAsync(async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    req.flash('success', 'Successfully made a new restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`);
}));

//show entry
router.get("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id).populate("reviews");
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        res.redirect("/restaurants");
    }
    res.render("restaurants/show", { restaurant });
}));

//render edit form
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        res.redirect("/restaurants");
    }
    res.render("restaurants/edit", { restaurant });
}));

//update restaurant
router.put("/:id", isLoggedIn, validateRestaurant, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndUpdate(id, req.body.restaurant, { runValidators: true });
    req.flash('success', 'Successfully updated restaurant!');
    res.redirect(`/restaurants/${id}`);
}));

//DELETE restaurant
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted restaurant!');
    res.redirect("/restaurants");
}));

module.exports = router;