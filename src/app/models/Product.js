const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 255,
            required: [true, 'Please add a name'],
        },
        price: {
            type: Number,
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
        catelogies: {
            type: String,
        },
        standOut: { type: Boolean, default: true },
        slug: {
            type: String,
            slug: 'name',
            unique: true,
        },
        userID: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true},
);
mongoose.plugin(slug);
ProductSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
module.exports = mongoose.model('Product', ProductSchema);
