const express = require("express");
const app = express();
const PORT = 3000;
const path = require('path');
const method_override = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./util/wrapAsync');
const ExpressError = require("./util/ExpressError.js");
const Joi = require('joi');
const { restaurantSchema, reviewSchema } = require('./schemas.js');
const mongoose = require('mongoose');
const Restaurant = require("./models/restaurant");
const Review = require('./models/review');

const restaurantRouter = require('./routes/restaurantRoutes');
const reviewRouter = require('./routes/reviewRoutes');

app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middle wares
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));
app.use(morgan('dev'));
app.use(express.static('./public'));
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
app.use('/restaurants', restaurantRouter);
app.use('/restaurants/:id/reviews', reviewRouter);

// home route
app.get("/", (req, res) => {
    res.render("home");
});

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(element => element.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

app.all("*", (req, res) => {
    throw new ExpressError("Page Not Found", 404);
})

//error handling middleware
app.use((err, req, res, next) => {
    if (!err.message) {
        err.message = "Something Went Wrong";
    }
    const {statusCode = 500} = err;
    res.status(statusCode).render("error.ejs", { err });
});
