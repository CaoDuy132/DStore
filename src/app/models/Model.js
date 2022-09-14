const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mongooseToObject } = require('../../util/mongoose');
const Schema = mongoose.Schema;
options = {
    separator: '',
    lang: 'en',
    truncate: 120,
};
const ProductSchema = new Schema(
    {
        _id: { type: Number, require: true },
        name: {
            type: String,
            trim: true,
            maxLength: 255,
            required: [true, 'Please add a name'],
        },
        price: {
            type: String,
            maxLength: 255,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        standOut: { type: Boolean, default: true },
        slug: {
            type: String,
            slug: 'name',
            unique: true,
        },
        userID: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true, _id: false },
);
const UserSchema = new Schema(
    {
        fullname: { type: String, trim: true },
        username: { type: String, slug: 'fullname', unique: true, trim: true },
        phone: { type: Number, trim: true },
        email: { type: String, unique: true, lowercase: true, trim: true },
        role: { type: String, default: 'User' },
        password: { type: String, required: true, trim: true },
        address: { type: String, trim: true },
        verificationToken: { type: String },
        image: { type: String, default: 'avatar.jpg' },
        productID: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        tokens: [
            {
                token: { type: String, required: true },
            },
        ],
    },
    {
        timestamps: true,
    },
);
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
const OrderShema = new Schema(
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

mongoose.plugin(slug);
UserSchema.pre('save', async function hashPassword(next) {
    try {
        //Generate a salt
        const salt = await bcrypt.genSalt(10);
        //Generate a password hash (salt + hash)
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        next(err);
    }
});
UserSchema.methods.hashPassword = async function (password) {
    try {
        //Generate a salt
        const salt = await bcrypt.genSalt(10);
        //Generate a password hash (salt + hash)
        password = await bcrypt.hash(password, salt);
        return password;
    } catch (err) {
        next(err);
    }
};
UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
ProductSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
//add plugin
mongoose.plugin(slug);
// plugin autoIncrement id
ProductSchema.plugin(AutoIncrement);
let Product = mongoose.model('Product', ProductSchema);
let User = mongoose.model('User', UserSchema);
module.exports = { Product, User };
