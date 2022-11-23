const Product = require('../models/Product');
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const {ACCESS_SECRET_TOKEN} = process.env || 'YOUR_ACCESS_SECRET_TOKEN';
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');
 const SiteController={
    index: async (req, res, next)=>{
   
       const products = await Product.find({});  
            try{
                res.render('shop/home',{
                    products: multipleMongooseToObject(products),
                    title: 'Trang chủ',
                })
            }catch(err){
                next(err)
            }
    },
    productDetail: (req, res, next)=>{  
        Product.findOne({ slug: req.params.slug })
            .then((product) => {
                res.render('shop/product-detail', {
                    product: mongooseToObject(product),
                });
            })
            .catch(next);
    },
    show: (req, res)=>{
        res.send('Index slug page');
    }
}
module.exports = SiteController;
