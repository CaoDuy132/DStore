const express = require('express');
const router = express.Router();
const ShopController = require('../app/controllers/ShopController');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
router.post('/addToCart',AuthMiddleware.verifyToken, ShopController.addToCart);
router.delete('/delete',AuthMiddleware.verifyToken, ShopController.deleteCart);
router.get('/cart',AuthMiddleware.verifyToken, ShopController.getCart);
router.get('/',AuthMiddleware.verifyToken, ShopController.getCart);
module.exports = router;
