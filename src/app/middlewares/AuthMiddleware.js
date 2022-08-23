const jwt = require('jsonwebtoken');
const { ACCESS_SECRET_TOKEN } = require('../../config/envConfig');
const { User } = require('../models/Model');

const AuthMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, ACCESS_SECRET_TOKEN, (err, decodeToken) => {
            if (err) {
                console.log(err.massage);
                res.redirect('/login');
            } else {
                res.currentUserId = decodeToken.id;
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};
module.exports = { AuthMiddleware };
