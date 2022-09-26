const mongoose = require('mongoose');
const Schema = mongoose.Schema;
options = {
    separator: '',
    lang: 'en',
    truncate: 120,
};
const CartShema = new Schema(
    {
        userId: { type: Number, require: true },
        cartId: { type: Number, require: true },
        status: { type: String, default: 'active' },
        modifiedOn: { type: Date, default: Date.now() },
        product: { type: Array },
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.model('Cart', CartShema);
