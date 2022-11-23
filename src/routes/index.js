const siteRouter = require('./site');
const adminRouter = require('./admin');
const cartRouter = require('./shop');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
function route(app) {

    app.use('/admin',AuthMiddleware.verifyAdmin, adminRouter);
    app.use('/cart',cartRouter);
    app.use('/', siteRouter);
}
module.exports = route;
