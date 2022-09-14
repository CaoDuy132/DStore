
const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
const authController = require('../app/controllers/authController');
const res = require('express/lib/response');
const passport =require('passport');
const initPassportLocal =require('../app/middlewares/PassportMiddleware');
initPassportLocal();
router.get('/register', authController.getRegisterForm);
router.get('/login', authController.getloginForm);
router.post('/login/store', passport.authenticate('local',{
    successRedirect: '/admin/list',
    failureRedirect: '/login'
}),
);
router.get('/currentUser', function(req,res,next){
    console.log('Token:::',req.session)
    if(req.isAuthenticated()){
        return res.json({
            message: 'Login successfully',
        })
    }
    return res.json('Login fail')
});
router.post('/register/store', authController.registerStore);
router.get('/logout', authController.logout);
router.get('/:slug', siteController.productDetail);
router.get('/', siteController.index);
module.exports = router;
