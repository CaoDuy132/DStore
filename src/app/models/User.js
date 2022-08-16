const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const jwt = require('jsonwebtoken');
const { mongooseToObject } = require('../../util/mongoose');
options = {
    separator: '',
    lang: 'en',
    truncate: 120,
};
const User = new Schema(
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
        isVerified: { type: Boolean, default: false },
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
mongoose.plugin(slug);
User.pre('save', async function hashPassword(next) {
    try {
        //Generate a salt
        const salt = await bcrypt.genSalt(10);
        //Generate a password hash (salt + hash)
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        next(err);
    }
});
User.methods.hashPassword = async function (password) {
    try {
        //Generate a salt
        const salt = await bcrypt.genSalt(10);
        //Generate a password hash (salt + hash)
        password = await bcrypt.hash(password, salt);
        console.log('password la', password);
        return password;
    } catch (err) {
        next(err);
    }
};
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
module.exports = mongoose.model('User', User);
