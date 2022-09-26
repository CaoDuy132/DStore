const siteRouter = require('./site');
const adminRouter = require('./admin');
const cartRouter = require('./shop');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const User = require('../app/models/User');
function route(app) {

    app.use('/admin', AuthMiddleware.verifyAdmin, adminRouter);
    app.use('/cart', cartRouter);
    app.use('/', siteRouter);
}
module.exports = route;
