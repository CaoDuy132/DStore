const Product = require('../models/Product');
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');

class SiteController {
    //[GET]/news
    index(req, res, next) {
        Product.find({})
            .then((products) => {
                res.render('home', {
                    title: 'Trang chủ',
                    products: multipleMongooseToObject(products),
                });
            })

            .catch(next);
    }
    //[GET]/news/:slug
    productDetail(req, res, next) {
        Product.findOne({ slug: req.params.slug })
            .then((product) => {
                res.render('product-detail', {
                    product: mongooseToObject(product),
                });
            })
            .catch(next);
    }
    show(req, res) {
        res.send('Index slug page');
    }
}
module.exports = new SiteController();
