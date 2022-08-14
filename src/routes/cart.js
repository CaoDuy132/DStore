const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/CartController');
router.get('/:slug', cartController.show);
router.post('/add-to-cart', cartController.addToCart);
router.get('/', cartController.index);
module.exports = router;
