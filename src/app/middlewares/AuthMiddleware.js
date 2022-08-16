const jwt = require('jsonwebtoken');
const { ACCESS_SECRET_TOKEN } = require('../../config/envConfig');
const User = require('../models/User');
const AuthMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, ACCESS_SECRET_TOKEN, (err, decodeToken) => {
            if (err) {
                console.log(err.massage);
                res.redirect('/admin/login');
            } else {
                res.currentUserId = decodeToken.id;
                next();
            }
        });
    } else {
        res.redirect('/admin/login');
    }
};
module.exports = { AuthMiddleware };
