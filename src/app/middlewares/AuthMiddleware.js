const jwt = require('jsonwebtoken');
const {
    ACCESS_SECRET_TOKEN,
    ACCESS_REFRESH_TOKEN,
} = require('../../config/envConfig');
const AuthMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, ACCESS_SECRET_TOKEN, (err, user) => {
                if (err) {
                    console.log('Token is not valid');
                    res.redirect('/login');
                } else {
                    res.currentUserId = user.id;
                    req.user = user;
                    next();
                }
            });
        } else {
            res.redirect('/login');
        }
    },
    verifyAdmin: (req, res, next) => {
        
        AuthMiddleware.verifyToken(req, res, () => {
            if (
                req.user.id == req.params.id ||
                req.user.role.toLowerCase() == 'admin'
            ) {
                next();
            } else {
                res.status(500).json(
                    'Không đủ quyền để  thực hiện thao tác này!',
                );
            }
        });
    },
    // protect: async (req, res, next) => {
    //     let token;
    //     if (
    //         req.header.authorization &&
    //         req.header.authorization.startWith('Bearer')
    //     ) {
    //         token = req.header.authorization.split(' ')[1];
    //     } else if (req.cookies.jwt) {
    //         token = req.cookies.jwt;
    //     }
    //     if (!token) {
    //         return res.status(401).json({ message: 'Vui lòng đăng nhập' });
    //     }
    // },
};
module.exports = AuthMiddleware;
