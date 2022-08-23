const siteRouter = require('./site');
const adminRouter = require('./admin');
const { AuthMiddleware } = require('../app/middlewares/AuthMiddleware');
function route(app) {
    app.use('/admin', AuthMiddleware, adminRouter);
    app.use('/', siteRouter);
}
module.exports = route;