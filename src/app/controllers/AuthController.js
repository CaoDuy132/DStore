const res = require('express/lib/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mongooseToObject } = require('../../util/mongoose');
const { ACCESS_SECRET_TOKEN } = process.env;
const User = require('../models/User');
class AuthController {
    getRegisterForm(req, res, next) {
        res.render('shop/register', { layout: false });
    }
    createAccessToken(user, timing) {
        const id = user._id;
        return jwt.sign({ id }, ACCESS_SECRET_TOKEN, {
            expiresIn: timing,
        });
    }
    //[POST] /registerStore
    registerStore(req, res, next) {
        const { fullname, phone, email, password } = req.body;
        User.findOne({ email })
            .then((user) => {
                let foundUser = mongooseToObject(user);
                if (foundUser) {
                    return res.json({
                        success: false,
                        msg: 'Email already exists',
                    });
                }
                const newUser = new User({
                    fullname,
                    phone,
                    email,
                    password,
                });
                newUser.save();
                return res.json({
                    success: true,
                    message: 'Register successfully',
                });
            })
            .catch((err) => {
                console.log('err: ', err);
            });
    }
    //[GET] /login
    getloginForm(req, res, next) {
        res.render('shop/login', { title: 'Admin | login', layout: false });
    }
    //[POST] /loginStore
    loginStore(req, res, next) {
        const { email, password } = req.body;
        User.findOne({ email })
            .then((foundUser) => {
                if (foundUser) {
                    bcrypt
                        .compare(password, foundUser.password)
                        .then((data) => {
                            if (data) {
                                let UserToken = new AuthController();
                                //set cookies
                                const token = UserToken.createAccessToken(
                                    foundUser,
                                    '365d',
                                );
                                res.setHeader('Authorization', token);
                                return res.status(200).json({
                                    success: true,
                                    token: token,
                                    msg: 'Login successfully',
                                });
                            } else {
                                return res.json({
                                    success: false,
                                    msg: 'Mật khẩu không đúng',
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else {
                    res.json({
                        success: false,
                        msg: 'Email không tồn tại',
                    });
                }
            })
            .catch(next);
    }
    //[GET] /admin/login
    getAdminForm(req, res, next) {
        res.render('admin/user/login', {
            title: 'Admin | login',
            layout: false,
        });
    }
    //[POST] /admin/loginStore
    async loginAdminStore(req, res, next) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        try {
            if (user && user.role == 1) {
                const match = bcrypt.compare(password, user.password);
                if (match) {
                    let UserToken = new AuthController();
                    const token = UserToken.createAccessToken(user, '2d');
                    return res.json({
                        success: true,
                        token: token,
                        msg: 'Login admin successfully',
                    });
                } else {
                    return res.json({
                        success: false,
                        msg: 'Mật khẩu không đúng',
                    });
                }
            } else {
                res.json({
                    success: false,
                    msg: 'Email không tồn tại',
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
    logout(req, res, next) {
        res.cookie('jwt', '');
        res.redirect('/');
    }
}
module.exports = new AuthController();
