const express = require('express');
const router = express.Router();
const productController = require('../../controllers/controller_product');
const auth = require('../auth');

//api/product
router.param('product', productController.paramsProduct);
router.param('comment', productController.paramsComment);

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:slug', productController.getProduct);
router.put('/:slug', productController.updateProduct);
router.delete('/:slug', productController.deleteProduct);

router.post('/:product/fav', auth.required, productController.favProduct);
router.delete('/:product/fav', auth.required, productController.unfavProduct);

router.get('/:product/comment', auth.optional, productController.getComments);
router.post('/:product/comment', auth.required, productController.addComment);
router.delete('/:product/comments/:comment', auth.required, productController.removeComment);


module.exports = router;