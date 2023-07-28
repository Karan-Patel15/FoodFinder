const express = require("express");
const app = express();
const PORT = 3000;
const path = require('path');
const method_override = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./util/wrapAsync');
const ExpressError = require("./util/ExpressError.js")
const mongoose = require('mongoose');
const Restaurant = require("./models/restaurant");

app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(method_override("_method"));
app.use(morgan('dev'));
app.use(express.static('./public'))
app.use((req, res, next) => {
    next();
})

app.engine('ejs', ejsMate);

mongoose.connect('mongodb://127.0.0.1:27017/food-finder')
.then(() => {
    console.log("Mongo Connection Open");
})
.catch(err => {
    console.log("Mongo Connection Error");
    console.log(err);
})


app.listen(PORT, () => {
    console.log(`Listening On Port ${PORT}`)
});




app.get("/", (req, res) => {
    res.render("home");
});

//index page show all restaurants
app.get("/restaurants", wrapAsync(async(req, res) => {
    const restaurants = await Restaurant.find({});
    res.render("restaurants/index", {restaurants});
}));

//render new entry form
app.get("/restaurants/new", (req, res) => {
    res.render("restaurants/new");
})

//creation
app.post("/restaurants", wrapAsync(async(req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
}));

//show entry
app.get("/restaurants/:id", wrapAsync(async(req, res) => {
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id);
    res.render("restaurants/show", {restaurant});
}));

//render edit form
app.get("/restaurants/:id/edit", wrapAsync(async(req, res) => {
    const {id} = req.params
    const restaurant = await Restaurant.findById(id);
    res.render("restaurants/edit", {restaurant});
}));

//update entry
app.put("/restaurants/:id", wrapAsync(async(req, res) => {
    const {id} = req.params;
    await Restaurant.findByIdAndUpdate(id, req.body.restaurant, { runValidators: true});
    res.redirect(`/restaurants/${id}`);
}));

app.delete("/restaurants/:id", wrapAsync(async(req, res) => {
    const {id} = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect("/restaurants");
}));

app.all("*", (req, res) => {
    throw new ExpressError("Page Not Found", 404);
})

//error handling middleware
app.use((err, req, res, next) => {
    if (!err.message) {
        err.message = "Something Went Wrong";
    }
    res.status(err.statusCode).render("error.ejs", {err});
});