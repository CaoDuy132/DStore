const jwt = require('jsonwebtoken');
const { ACCESS_SECRET_TOKEN } = require('../../config/envConfig');
const { User } = require('../models/Model');

class AuthMiddleware{
    verifyToken(req, res, next){
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
    };
    verifyAdmin(req,res,next){
        const verified = new AuthMiddleware();
        verified.verifyToken(req,res,()=>{
            if(req.user.id == req.params.id || req.user.role == 'Admin'){
                next();
            }else{
                res.status(403).json('Không được xóa người dùng này');
            }
        });
    }
    
}

module.exports = new AuthMiddleware();
