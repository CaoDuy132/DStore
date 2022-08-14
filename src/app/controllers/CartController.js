const res = require('express/lib/response');

class CartController {
    //[GET]/news
    index(req, res) {
        res.json('cart page');
    }
    show(req, res) {
        res.json('cart page');
    }
    //[GET]/news/:slug
    addToCart(req, res) {
        res.json(req.body);
        const product = new Product(req.body);
        product
            .save()
            .then(() => res.redirect('/admin/list'))
            .catch(next);
    }
}
module.exports = new CartController();
