const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/controller_category')

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategory);
router.put('/:slug', categoryController.updateCategory);
router.delete('/:slug', categoryController.deleteCategory);

module.exports = router;