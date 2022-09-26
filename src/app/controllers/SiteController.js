const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {ACCESS_SECRET_TOKEN} = process.env || 'YOUR_ACCESS_SECRET_TOKEN';
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');
 const SiteController={
    //[GET]/news
    index: async (req, res, next)=>{
       const products = await Product.find({});
       const token = req.cookies.jwt;
       if (token) {
        jwt.verify(token, ACCESS_SECRET_TOKEN, (err, user) => {
            if (user) {
                res.currentUserId = user.id;
                req.user = user;
            }else{
                req.user =null;
            }
        });
    }
    let currentUser = null;
       if(req.user){
             currentUser = await User.findById(req.user.id) 
        }
            try{
                res.render('shop/home',{
                    products: multipleMongooseToObject(products),
                    title: 'Trang chủ',
                    currentUser: mongooseToObject(currentUser)
                })
            }catch(err){
                next(err)
            }
    },
    //[GET]/news/:slug
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
