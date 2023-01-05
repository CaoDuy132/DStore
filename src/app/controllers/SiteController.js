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
            const PAGE_SIZE = 8;
            let page = req.query.page
            if(!page || page <1){
                page = 1;
            }
            const SKIP = (page -1)* PAGE_SIZE;
            const products = await Product.find({}).skip(SKIP).limit(8);
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
