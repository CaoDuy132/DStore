const express = require('express');
const router = express.Router();
const SiteController = require('../app/controllers/SiteController')
const AuthController = require('../app/controllers/AuthController');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
// const _ = require('lodash');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { ACCESS_SECRET_TOKEN } = process.env;
const  User = require('../app/models/User');

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
            secretOrKey: ACCESS_SECRET_TOKEN,
        },
        async (payload, done) => {
            try {
                const user = await User.findOne({ _id: payload.id });
                if (!user) return done(null, false);

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        },
    ),
);
router.get('/register', AuthController.getRegisterForm);
router.get('/login', AuthController.getloginForm);
router.post('/login/store', AuthController.loginStore);
router.get(
    '/secret',
    passport.authenticate('jwt', { session: false }),
    function (req, res, next) {
        return res.json('Login successfully');
    },
);
router.post('/register/store', AuthController.registerStore);
router.get('/logout', AuthController.logout);
router.get('/:slug', SiteController.productDetail);
router.get('/',SiteController.index);
module.exports = router;
