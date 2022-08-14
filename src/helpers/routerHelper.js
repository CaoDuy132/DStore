const Joi = require('joi');
const schema = {
    authSignInSchema: Joi.object().keys({
        email: Joi.string().email().required,
        passsword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    }),
};
module.exports = schema;
