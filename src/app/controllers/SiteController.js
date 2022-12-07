const Product = require('../models/Product');
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const { ACCESS_SECRET_TOKEN } = process.env || 'YOUR_ACCESS_SECRET_TOKEN';
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');
const SiteController = {
    index: async (req, res, next) => {
        try {
            const products = await Product.find({});
            res.render('shop/home', {
                products: multipleMongooseToObject(products),
                title: 'Trang chủ',
                currentUser: mongooseToObject(req.user)
            });
        } catch (err) {
            next(err);
        }
    },
    productDetail: async(req, res, next) => {
        try{
            const product = await Product.findOne({ slug: req.params.slug })
            res.render('shop/product-detail', {
                product: mongooseToObject(product),
                currentUser: mongooseToObject(req.user)
            });
        }catch(err){
            console.log(err)
        }
    },
    show: (req, res) => {
        res.send('Index slug page');
    },
};
module.exports = SiteController;
