const express = require('express');
const router = express.Router()

const wrapAsync = require('../util/wrapAsync');
const ExpressError = require("../util/ExpressError.js");
const Restaurant = require("../models/restaurant");
const Joi = require('joi');
const { restaurantSchema } = require('../schemas.js');


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
router.get("/new", (req, res) => {
    res.render("restaurants/new");
})

//create restaurant
router.post("/", validateRestaurant, wrapAsync(async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
}));

//show entry
router.get("/:id", wrapAsync(async (req, res) => {
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id).populate("reviews");
    res.render("restaurants/show", { restaurant });
}));

//render edit form
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id);
    res.render("restaurants/edit", { restaurant });
}));

//update restaurant
router.put("/:id", validateRestaurant, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndUpdate(id, req.body.restaurant, { runValidators: true });
    res.redirect(`/restaurants/${id}`);
}));

//DELETE restaurant
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect("/restaurants");
}));

module.exports = router;