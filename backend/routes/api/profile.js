const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/controller_profile');
const auth = require('../auth');

router.param('username', profileController.paramsProfile);
router.get('/:username', auth.optional, profileController.getProfile);

router.get('/:username/followers', auth.optional, profileController.getFollowers);
router.get('/:username/followings', auth.optional, profileController.getFollowings);
router.get('/:username/comments', auth.optional, profileController.getComments);
router.get('/:username/likes', auth.optional, profileController.getLikes);

router.post('/:username/follow', auth.required, profileController.followProfile);
router.delete('/:username/follow', auth.required, profileController.unfollowProfile);

module.exports = router;