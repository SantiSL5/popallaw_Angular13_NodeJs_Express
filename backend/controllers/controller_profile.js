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
    let resultFollowers= [];
    req.query.offset == undefined || req.query.offset < 0 ? offset = 0 : offset = Number(req.query.offset);
    req.query.limit == undefined || req.query.limit <= 0 ? limit = 5 : limit = Number(req.query.limit);

    let followers = await User.aggregate([
        { $project: { "following": 1, "username": 1, "image": 1 } },
        { $unwind: '$following' },
        { $match: { 'following': req.profile._id } }
    ])

    let numItems= followers.length;

    for (let i = 0; i < limit; i++) {
        if (followers[i+offset] != undefined) {
            resultFollowers.push(followers[i+offset]); 
        }
    }

    if (req.payload) {
        await User.findById(req.payload.id).then(function (user) {
            for (let i = 0; i < resultFollowers.length; i++) {
                resultFollowers[i].isFollowed = user.isFollowing(resultFollowers[i]._id);
            }
        });
    }

    return res.json({
        "numItems": numItems,
        "followers": resultFollowers
    });
}

exports.getFollowings = async (req, res) => {
    let offset;
    let limit;
    let resultFollowings= [];
    let numItems= 0;
    req.query.offset == undefined || req.query.offset < 0 ? offset = 0 : offset = Number(req.query.offset);
    req.query.limit == undefined || req.query.limit <= 0 ? limit = 5 : limit = Number(req.query.limit);

    let followings = await User.findById(req.profile._id).populate("following").select("following")
    if (followings.following.length > 0) {
        followings=followings.following;
        numItems= followings.length;
        for (let i = 0; i < limit; i++) {
            if (followings[i+offset] != undefined) {
                resultFollowings.push(followings[i+offset]); 
            }
        }
    
    }

    if (req.payload) {
        await User.findById(req.payload.id).then(function (user) {
            for (let i = 0; i < resultFollowings.length; i++) {
                resultFollowings[i].salt = user.isFollowing(resultFollowings[i]._id);
            }
        });
    }
    return res.json({
        "numItems": numItems,
        "followings": resultFollowings
    });
}

exports.getComments = async (req, res) => {
    let offset;
    let limit;
    let resultComments= [];
    req.query.offset == undefined || req.query.offset < 0 ? offset = 0 : offset = Number(req.query.offset);
    req.query.limit == undefined || req.query.limit <= 0 ? limit = 5 : limit = Number(req.query.limit);

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

    ])

    let numItems= comments.length;
    for (let i = 0; i < limit; i++) {
        if (comments[i+offset] != undefined) {
            resultComments.push(comments[i+offset]); 
        }
    }

    return res.json({
        "numItems": numItems,
        "comments": resultComments
    });
}

exports.getLikes = async (req, res) => {
    let offset;
    let limit;
    let resultLikes= [];
    req.query.offset == undefined || req.query.offset < 0 ? offset = 0 : offset = Number(req.query.offset);
    req.query.limit == undefined || req.query.limit <= 0 ? limit = 5 : limit = Number(req.query.limit);
    let likes = await User.findById(req.profile._id).populate("favorites").select("favorites");
    let numItems= likes.favorites.length;
    likes = likes.favorites;
    for (let i = 0; i < limit; i++) {
        if (likes[i+offset] != undefined) {
            resultLikes.push(likes[i+offset]); 
        }
    }
    if (req.payload) {
        await User.findById(req.payload.id).then(function (user) {
            for (let i = 0; i < resultLikes.length; i++) {
                resultLikes[i].favorited = user.isFavorite(resultLikes[i]._id);
            }
        });
    }

    return res.json({
        "numItems": numItems,
        "likes": resultLikes
    });
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