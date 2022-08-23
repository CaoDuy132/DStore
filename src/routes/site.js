const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const authController = require('../app/controllers/authController');
router.get('/register', authController.getRegisterForm);
router.get('/login', authController.getloginForm);
router.post('/login/store', authController.loginStore);
router.post('/register/store', authController.registerStore);
router.get('/logout', authController.logout);
router.get('/:slug', siteController.productDetail);
router.get('/', siteController.index);
module.exports = router;
