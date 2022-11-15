const User = require('../models/user');
const Product = require('../models/product');

exports.paramsProfile = async (req, res, next, username) => {
    User.findOne({ username: username }).then(function (user) {
        if (!user) {
            return res.json({ profile: "notFound" });
        } else {
            req.profile = user;
            return next();
        }
    }).catch(next);
}

exports.getProfile = async (req, res) => {
    let numFollowers = await User.aggregate([
        { $project: { "following": 1 } },
        { $unwind: '$following' },
        {
            $group: {
                _id: '$following',
                count: { $sum: 1 }
            }
        },
        { $match: { '_id': req.profile._id } }
    ]);

    let numComments = await Product.aggregate([
        { $project: { "comments": 1 } },
        { $match: { 'comments': { $exists: true, $ne: [] } } },
        { $unwind: '$comments' },
        {
            $lookup: {
                from: "comments",
                localField: "comments",
                foreignField: "_id",
                as: "comments"
            }
        },
        { $unwind: '$comments' },
        {
            $group: {
                _id: '$comments.author',
                count: { $sum: 1 }
            }
        },
        { $match: { "_id": req.profile._id } },
    ]);

    let comments = numComments.length == 0 ? 0 : numComments[0].count;
    let follows = numFollowers.length == 0 ? 0 : numFollowers[0].count;
    if (req.payload) {
        User.findById(req.payload.id).then(function (user) {
            if (!user) { return res.json({ profile: req.profile.toProfileJSONFor(false, follows, comments) }); }

            return res.json({ profile: req.profile.toProfileJSONFor(user, follows, comments) });
        });
    } else {
        return res.json({ profile: req.profile.toProfileJSONFor(false, follows, comments) });
    }
}

exports.getFollowers = async (req, res) => {
    let offset;
    let limit;
    req.query.offset == undefined || req.query.offset < 0 ? offset = 0 : offset = req.query.offset;
    req.query.limit == undefined || req.query.offset <= 0 ? limit = 5 : offset = req.query.limit;

    let followers = await User.aggregate([
        { $project: { "following": 1, "username": 1, "image": 1 } },
        { $unwind: '$following' },
        { $match: { 'following': req.profile._id } }
    ]).limit(limit).skip(offset);

    return res.json(followers);
}

exports.getFollowings = async (req, res) => {
    let offset;
    let limit;
    req.query.offset == undefined || req.query.offset < 0 ? offset = 0 : offset = req.query.offset;
    req.query.limit == undefined || req.query.offset <= 0 ? limit = 5 : offset = req.query.limit;

    let followings = await User.findById(req.profile._id).populate("following").select("following").limit(limit).skip(offset);
    followings=followings.following;
    return res.json(followings);
}

exports.getComments = async (req, res) => {
    let offset;
    let limit;
    req.query.offset == undefined || req.query.offset < 0 ? offset = 0 : offset = req.query.offset;
    req.query.limit == undefined || req.query.offset <= 0 ? limit = 5 : offset = req.query.limit;

    let comments = await Product.aggregate([
        { $project: { "comments": 1, "photo": 1, "name": 1, "slug": 1 } },
        { $match: { 'comments': { $exists: true, $ne: [] } } },
        { $unwind: '$comments' },
        {
            $lookup: {
                from: "comments",
                localField: "comments",
                foreignField: "_id",
                as: "comments"
            }
        },
        { $unwind: '$comments' },
        {
            $lookup: {
                from: "product",
                localField: "product",
                foreignField: "_id",
                as: "product"
            }
        },
        { $match: { "comments.author": req.profile._id } }

    ]).limit(limit).skip(offset);

    return res.json(comments);
}

exports.getLikes = async (req, res) => {
    let offset;
    let limit;
    req.query.offset == undefined || req.query.offset < 0 ? offset = 0 : offset = req.query.offset;
    req.query.limit == undefined || req.query.offset <= 0 ? limit = 5 : offset = req.query.limit;
    let likes = await User.findById(req.profile._id).populate("favorites").select("favorites").limit(limit).skip(offset);
    likes = likes.favorites;
    console.log(likes);
    if (req.payload) {
        console.log(req.payload);
        await User.findById(req.payload.id).then(function (user) {
            for (let i = 0; i < likes.length; i++) {
                likes[i].favorited = user.isFavorite(likes[i]._id);
            }
        });
    }

    return res.json(likes);
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