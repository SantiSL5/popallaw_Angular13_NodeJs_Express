const User = require('../models/user');

exports.paramsProfile = async (req, res, next, username) => {
    User.findOne({ username: username }).then(function (user) {
        if (!user) { 
            return res.json({ profile: "notFound"}); 
        } else {
            req.profile = user;
            return next();
        }
    }).catch(next);
}

exports.getProfile = async (req, res) => {
    if (req.payload) {
        User.findById(req.payload.id).then(function (user) {
            if (!user) { return res.json({ profile: req.profile.toProfileJSONFor(false) }); }

            return res.json({ profile: req.profile.toProfileJSONFor(user) });
        });
    } else {
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
    }
}

exports.followProfile = async (req, res) => {
    var profileId = req.profile._id;

    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }

        return user.follow(profileId).then(function () {
            return res.json({ profile: req.profile.toProfileJSONFor(user) });
        });
    });
}

exports.unfollowProfile = async (req, res, next) => {
    var profileId = req.profile._id;

    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }

        return user.unfollow(profileId).then(function () {
            return res.json({ profile: req.profile.toProfileJSONFor(user) });
        });
    });
}