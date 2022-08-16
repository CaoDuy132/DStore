const res = require('express/lib/response');

class AuthController {
    logout(req, res, next) {
        res.cookie('jwt', '');
        res.redirect('/admin/login');
    }
}
module.exports = new AuthController();
