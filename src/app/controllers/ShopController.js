const Product = require('../models/Product');
const User = require('../models/User');
const {
    mongooseToObject,
    multipleMongooseToObject,
} = require('../../util/mongoose');
const CartController = {
    addToCart: async (req, res, next) => {
        try {
            const currentUser = await User.findById(req.user.id);
            currentUser.addToCart(req.body.id);
            res.redirect('back');
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    getCart: async (req, res, next) => {
        const currentUser = await User.findById(req.user.id);
        currentUser
            .populate('cart.items.productId')
            .then((user) => {
                res.render('shop/cart', {
                    carts: multipleMongooseToObject(user.cart.items),
                    totalPrice: user.cart.totalPrice,
                    currentUser: mongooseToObject(req.user),
                    title: 'Dstore | cart',
                });
            })
            .catch((err) => console.log(err));
    },
    deleteCart: async (req, res, next) => {
        try {
            const { productId } = req.body;
            const currentUser = await User.findById(req.user.id);
            currentUser.removeFromCart(productId);
            return res.redirect('back');
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
};
module.exports = CartController;
