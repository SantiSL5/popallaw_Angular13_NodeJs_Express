const express = require('express');
const router = express.Router();
const userController = require('../../controllers/controller_user');
const auth = require('../auth');

router.get('/', auth.required, userController.loadUser);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.put('/update', auth.required, userController.updateUser);

module.exports = router;
