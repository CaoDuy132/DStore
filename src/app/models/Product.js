const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const Product = new Schema(
    {
        _id: { type: Number, require: true },
        name: {
            type: String,
            trim: true,
            maxLength: 255,
            required: [true, 'Please add a name'],
        },
        price: { type: String, maxLength: 255, required: true },
        description: { type: String, trim: true, required: true },
        image: { type: String, required: true },
        slug: { type: String, slug: 'name', unique: true },
    },
    { timestamps: true, _id: false },
);
const Cart = new Schema(
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
const Order = new Schema(
    {
        cartId: { type: Number, require: true },
        orderId: { type: Number, require: true },
        userId: { type: Number, require: true },
        shipping: { type: Object },
        payment: { type: Object },
        products: { type: Array },
    },
    {
        timestamps: true,
    },
);
//add plugin
mongoose.plugin(slug);
Product.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
// plugin autoIncrement id
Product.plugin(AutoIncrement);
module.exports = mongoose.model('Product', Product);
