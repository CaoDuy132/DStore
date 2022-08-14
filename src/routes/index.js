const newsRouter = require('./news');
const siteRouter = require('./site');
const searchRouter = require('./search');
const adminRouter = require('./admin');
const cartRouter = require('./cart');

function route(app) {
    app.use('/news', newsRouter);
    app.use('/search', searchRouter);
    app.use('/admin', adminRouter);
    app.use('/cart', cartRouter);
    app.use('/', siteRouter);
}
module.exports = route;
