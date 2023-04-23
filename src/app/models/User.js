const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Product = require('./Product');
options = {
    separator: '',
    lang: 'en',
    truncate: 120,
};
const UserSchema = new Schema(
    {
        fullname: { type: String, trim: true },
        username: { type: String, slug: 'fullname', unique: true, trim: true },
        phone: { type: Number, trim: true },
        email: { type: String, unique: true, lowercase: true, trim: true },
        role: { type: Number, default: 0 },
        password: { type: String, trim: true },
        authType: {
            type: String,
            enum: ['system', 'google', 'facebook'],
            default: 'system',
        },
        address: { type: String, trim: true },
        image: {
            public_id: { type: String },
            url: { type: String },
        },
        googleId: { type: String, default: null },
        faceBookId: { type: String, default: null },
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
        cart: {
            items: [
                {
                    productId: {
                        type: mongoose.Types.ObjectId,
                        ref: 'Product',
                        required: true,
                    },
                    qty: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            totalPrice: { type: Number },
        },
    },
    {
        timestamps: true,
    },
);
UserSchema.pre('save', async function (next) {
    try {
        if (this.googleId || this.faceBookId) {
            next();
        } else {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});
UserSchema.methods.addToCart = async function (productId) {
    try {
        const product = await Product.findById(productId);
        if (product) {
            const cart = this.cart;
            const isExisting = cart.items.findIndex(
                (objInItems) =>
                    new String(objInItems.productId).trim() ===
                    new String(product._id).trim(),
            );
            if (isExisting >= 0) {
                cart.items[isExisting].qty += 1;
            } else {
                cart.items.push({ productId: product._id, qty: 1 });
            }
            if (!cart.totalPrice) {
                cart.totalPrice = 0;
            }
            cart.totalPrice += product.price;
            return this.save();
        } else {
            console.log('Product not found');
        }
    } catch (err) {
        console.log(err);
    }
};
UserSchema.methods.removeFromCart = async function (productId) {
    const cart = this.cart;
    const isExisting = cart.items.findIndex(
        (objInItems) =>
            new String(objInItems.productId).trim() ===
            new String(productId).trim(),
    );
    if (isExisting >= 0) {
        const prod = await Product.findById(productId);
        cart.totalPrice -= prod.price * cart.items[isExisting].qty;
        cart.items.splice(isExisting, 1);
        return this.save();
    }
};
UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
mongoose.plugin(slug);
module.exports = mongoose.model('User', UserSchema);
