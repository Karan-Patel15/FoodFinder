const Joi = require('joi');

module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        name: Joi.string(),
        description: Joi.string().required(),
        address: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})