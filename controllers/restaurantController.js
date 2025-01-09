const wrapAsync = require('../util/wrapAsync');
const Restaurant = require("../models/restaurant");

showIndex = wrapAsync(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render("restaurants/index", { restaurants });
});

renderNewRestaurantForm = (req, res) => {
    res.render("restaurants/new");
}

createRestaurant =  wrapAsync(async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'Successfully made a new restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`);
});

showRestaurant = wrapAsync(async (req, res) => {
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
});

renderEditRestaurantForm = wrapAsync(async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        res.redirect("/restaurants");
    }
    res.render("restaurants/edit", { restaurant });
});

updateRestaurant = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndUpdate(id, req.body.restaurant, { runValidators: true });
    req.flash('success', 'Successfully updated restaurant!');
    res.redirect(`/restaurants/${id}`);
});

deleteRestaurant = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted restaurant!');
    res.redirect("/restaurants");
})

module.exports = {showIndex, renderNewRestaurantForm,
    createRestaurant, showRestaurant, renderEditRestaurantForm, updateRestaurant, deleteRestaurant}