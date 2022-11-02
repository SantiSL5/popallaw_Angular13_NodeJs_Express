const express = require('express');
const router = express.Router();
const productController = require('../../controllers/controller_product');

//api/product
router.post('/login', productController.createProduct);
// router.post('/register', productController.createProduct);

module.exports = router;