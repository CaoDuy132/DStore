const Joi = require('joi');
function CreateValidate(data) {
    const createProduct = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        price: Joi.number().required(),
        images: Joi.string().required(),
        description: Joi.string().required,
    });
    return createProduct.validate(data);
}
module.exports = { CreateValidate };
