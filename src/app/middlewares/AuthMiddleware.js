const jwt = require('jsonwebtoken');
const {
    ACCESS_SECRET_TOKEN,
} = require('../../config/envConfig');
const AuthMiddleware = {
    verifyToken: (req,res,next)=>{
        next()
    },
    verifyAdmin: (req,res,next)=>{
        next()
    }
    // verifyToken: (req, res, next) => {
    //     const token = req.cookies.jwt;
    //     if (token) {
    //         jwt.verify(token, ACCESS_SECRET_TOKEN, (err, user) => {
    //             if (err) {
    //                 console.log('Token is not valid');
    //                 res.redirect('/login');
    //             } else {
    //                 res.currentUserId = user.id;
    //                 req.user = user;
    //                 next();
    //             }
    //         });
    //     } else {
    //         res.redirect('/login');
    //     }
    // },
    // verifyAdmin: (req, res, next) => {
        
    //     AuthMiddleware.verifyToken(req, res, () => {
    //         if (
    //             req.user.id == req.params.id ||
    //             req.user.role.toLowerCase() == 'admin'
    //         ) {
    //             next();
    //         } else {
    //             res.status(500).json(
    //                 'Không đủ quyền để  thực hiện thao tác này!',
    //             );
    //         }
    //     });
    // },
};
module.exports = AuthMiddleware;
