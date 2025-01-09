const express = require('express');
const router = express.Router()

const { isLoggedIn, isAuthor, validateRestaurant } = require('../util/middleware.js');
const restaurantController = require('../controllers/restaurantController.js');

router.route("/")
    //index page show all restaurants
    .get(restaurantController.showIndex)
    //create restaurant
    .post(isLoggedIn, validateRestaurant, restaurantController.createRestaurant)



//render new entry form
router.get("/new", isLoggedIn, restaurantController.renderNewRestaurantForm)


router.route("/:id")
    //show entry
    .get(restaurantController.showRestaurant)
    //update restaurant
    .put(isLoggedIn, isAuthor, validateRestaurant, restaurantController.updateRestaurant)
    //DELETE restaurant
    .delete(isLoggedIn, isAuthor, restaurantController.deleteRestaurant);

//render edit form
router.get("/:id/edit", isLoggedIn, isAuthor, restaurantController.renderEditRestaurantForm);


module.exports = router;