const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/controller_profile');
const auth = require('../auth');

router.param('username', profileController.paramsProfile);
router.get('/:username', auth.optional, profileController.getProfile);
router.post('/:username/follow', auth.required, profileController.followProfile);
router.delete('/:username/follow', auth.required, profileController.unfollowProfile);

module.exports = router;