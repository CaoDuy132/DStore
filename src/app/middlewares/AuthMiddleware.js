const jwt = require('jsonwebtoken');
const { ACCESS_SECRET_TOKEN } = process.env || 'YOUR_ACCESS_SECRET_TOKEN';
const AuthMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, ACCESS_SECRET_TOKEN, (err, user) => {
                if (err) {
                    console.log('err:::', err);
                    res.status(401).json({message: 'Unauthorized'});
                } else {
                    res.currentUserId = user.id;
                    req.user = user;
                    next();
                }
            });
        } else {
            return res.status(403).json({message: 'No token provided!'});
        }
    },
    verifyUser: (req,res,next)=>{
        AuthMiddleware.verifyToken(req, res, () => {
            if (
                req.user.id == req.params.id ||
                req.user.role == 0
            ) {
                next();
            } else {
                res.status(500).json(
                    'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục',
                );
            }
        });
    },
    verifyAdmin: (req, res, next) => {
        AuthMiddleware.verifyToken(req, res, () => {
            if (
                req.user.id == req.params.id ||
                req.user.role > 0
            ) {
                next();
            } else {
                res.status(500).json(
                    'Chức năng dành cho admin!',
                );
            }
        });
    },
};
module.exports = AuthMiddleware;
