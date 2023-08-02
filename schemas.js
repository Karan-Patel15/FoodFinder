const Joi = require('joi');

module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        name: Joi.string(),
        description: Joi.string().required(),
        address: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});