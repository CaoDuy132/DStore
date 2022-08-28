const res = require('express/lib/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mongooseToObject } = require('../../util/mongoose');
const { ACCESS_SECRET_TOKEN } = require('../../config/envConfig');
const { User } = require('../models/Model');
class AuthController {
    //[GET] /admin/register
    getRegisterForm(req, res, next) {
        res.render('log/register', { layout: false });
    }
    createAccessToken(user) {
        const id = user._id;
        return jwt.sign({ id, role: user.role }, ACCESS_SECRET_TOKEN, {
            expiresIn: '2h',
        });
    }
    createRefreshToken(user) {
        const id = user._id;
        return jwt.sign({ id, role: user.role }, ACCESS_SECRET_TOKEN, {
            expiresIn: '365d',
        });
    }
    //[POST] /admin/register/store
    registerStore(req, res, next) {
        const { fullname, phone, email, password } = req.body;
        User.findOne({ email })
            .then((user) => {
                let foundUser = mongooseToObject(user);
                if (foundUser) {
                    return res.json({ msg: 'Email đã tồn tại ', foundUser });
                }
                const newUser = new User({
                    fullname,
                    phone,
                    email,
                    password,
                });
                let UserToken = new AuthController();
                const token = UserToken.createAccessToken(newUser._id);
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                newUser.save();
                res.redirect('/login');
            })
            .catch((next) => {
                res.status(500).json(next);
            });
    }
    getloginForm(req, res, next) {
        res.render('log/login', { title: 'Admin | login', layout: false });
    }
    loginStore(req, res, next) {
        const { email, password } = req.body;

        const user = User.findOne({ email })
            .then((user) => {
                const foundUser = mongooseToObject(user);
                if (foundUser) {
                    bcrypt
                        .compare(password, foundUser.password)
                        .then((data) => {
                            if (data) {
                                let UserToken = new AuthController();
                                const token =
                                    UserToken.createAccessToken(foundUser);
                                const refreshToken =
                                    UserToken.createRefreshToken(foundUser);
                                res.cookie('jwt', token, { httpOnly: true });
                                res.redirect('/admin/list');
                            } else {
                                return res.json({
                                    success: false,
                                    massage: 'Mật khẩu không đúng',
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else {
                    res.json({
                        success: false,
                        massage: 'Email không tồn tại',
                    });
                }
            })
            .catch(next);
    }
    logout(req, res, next) {
        res.cookie('jwt', '');
        res.redirect('/login');
    }
}
module.exports = new AuthController();
