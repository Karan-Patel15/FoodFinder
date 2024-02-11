const mongoose = require('mongoose');
const Restaurant = require("../models/restaurant");
const restaurantData = require("./restaurantData");

mongoose.connect('mongodb://127.0.0.1:27017/food-finder')
.then(() => {
    console.log("Mongo Connection Open");
})
.catch(err => {
    console.log("Mongo Connection Error");
    console.log(err);
})

const seedDB = async function() {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 70; i++) {
        let res = restaurantData[i];
        let newRestaurant = new Restaurant(
            {
                author: "6584aacbeaebb597b9b0dc07", name: `${res.name}`,image: res.image_url, description: `${res.categories[0].title}`,
                address: `${res.location.display_address[0]},` + ` ${res.location.city}`
                + ` ${res.location.zip_code}`
        });
        await newRestaurant.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})


