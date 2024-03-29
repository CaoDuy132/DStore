const jwt = require('jsonwebtoken');
const { ACCESS_SECRET_TOKEN } = process.env || 'YOUR_ACCESS_SECRET_TOKEN';
const UserModel = require('../models/User');
const AuthMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, ACCESS_SECRET_TOKEN, async (err, idUser) => {
                if (err) {
                    res.status(401).json({
                        success: false,
                        message: 'Unauthorized',
                    });
                } else {
                    req.user = await UserModel.findById(idUser.id);
                    next();
                }
            });
        } else {
            return res.redirect('/login');
        }
    },
    verifyUser: (req, res, next) => {
        AuthMiddleware.verifyToken(req, res, () => {
            if (req.user.role < 1) {
                next();
            } else {
                return res.json({
                    success: false,
                    status: 401,
                    msg: 'Đăng nhập để tiếp tục',
                });
            }
        });
    },
    verifyAdmin: (req, res, next) => {
        AuthMiddleware.verifyToken(req, res, () => {
            if (req.user.role == 1) {
                next();
            } else {
                return res.json({
                    success: false,
                    status: 401,
                    msg: 'Chức năng dành cho admin ',
                });
            }
        });
    },
};
module.exports = AuthMiddleware;
