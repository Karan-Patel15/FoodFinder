const mongoose = require('mongoose');
const schema = mongoose.Schema;
const restaurantSchema = new schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
});
module.exports = mongoose.model("Restaurant", restaurantSchema);