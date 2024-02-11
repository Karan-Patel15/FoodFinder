const mongoose = require('mongoose');
const Review = require('./review.js');
const schema = mongoose.Schema;
const restaurantSchema = new schema({
    author: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
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
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
restaurantSchema.post('findOneAndDelete', async function (document) {
    console.log('----------------------------');
    if (document) { // if there is a deleted document
        //remove all Review documents whose ids are contained in the reviews array in the restaurant document
        await Review.deleteMany({
            _id: {
                $in: document.reviews
            }
        })

    }
})
module.exports = mongoose.model("Restaurant", restaurantSchema);