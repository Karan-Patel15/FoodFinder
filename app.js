const express = require("express");
const app = express();
const PORT = 3000;
const path = require('path');
const method_override = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const ExpressError = require("./util/ExpressError.js");
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
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

const sessionConfig = {
    secret: 'createBetterSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // returns empty array and sets up the flash architecture
    res.locals.error = req.flash('error')
    next();
})

app.use('/restaurants', restaurantRouter);
app.use('/restaurants/:id/reviews', reviewRouter);

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

// home route
app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res) => {
    throw new ExpressError("Page Not Found", 404);
})

//error handling middleware
app.use((err, req, res, next) => {
    if (!err.message) {
        err.message = "Something Went Wrong";
    }
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error.ejs", { err });
});
