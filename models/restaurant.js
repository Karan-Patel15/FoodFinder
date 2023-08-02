const mongoose = require('mongoose');
const schema = mongoose.Schema;
const restaurantSchema = new schema({
    name: {
        type: String,
        unique: true,
    },
    description: String,
    address: {
        type: String,
    },
    image: {
        type: String,
    },
});
module.exports = mongoose.model("Restaurant", restaurantSchema);