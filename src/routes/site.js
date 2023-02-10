const express = require('express');
const router = express.Router();
const SiteController = require('../app/controllers/SiteController');
const AuthController = require('../app/controllers/AuthController');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const PassportMiddleware = require('../app/middlewares/PassportMiddleware');
router.get('/register', AuthController.getRegisterForm);
router.post('/registerStore', AuthController.registerStore);
router.get('/login', AuthController.getloginForm);
router.post(
    '/auth/google',
    passport.authenticate('google-plus-token', { session: false }),
    SiteController.AuthGoogle,
);
router.post('/loginStore', AuthController.loginStore);
router.get('/logout', AuthController.logout);
router.get('/demoSocket', SiteController.demoSocket);
router.get(
    '/secret',
    passport.authenticate('jwt', { session: false }),
    function (req, res, next) {
        return res.json('Login successfully');
    },
);

router.get('/:slug', SiteController.productDetail);
router.get('/', SiteController.index);
module.exports = router;
