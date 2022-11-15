const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config({ path: 'variables.env' });
const secret = process.env.SECRET;


var UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    image: String,
    hash: String,
    salt: String,
    bio: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
});

// UserSchema.virtual('userProducts',{
//   ref: 'Product',
//   localField: 'id',
//   foreignField: 'seller'
// })

UserSchema.plugin(uniqueValidator, { message: '{PATH} is already taken.' });

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    };
};

UserSchema.methods.getFollowing = function () {
    return this.following.length
};

UserSchema.methods.getLikes = function () {
    return this.favorites.length
};

UserSchema.methods.toProfileJSONFor = function (user,followers,comments) {
    return {
        username: this.username,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
        following: user ? user.isFollowing(this._id) : false,
        numFollowing: this.getFollowing(),
        numLikes: this.getLikes(),
        numFollowers : followers,
        numComments : comments,
        bio: this.bio
    };
};

UserSchema.methods.favorite = function (id) {
    if (this.favorites.indexOf(id) === -1) {
        this.favorites.push(id);
    }

    return this.save();
};

UserSchema.methods.unfavorite = function (id) {
    this.favorites.remove(id);
    return this.save();
};

UserSchema.methods.isFavorite = function (id) {
    return this.favorites.some(function (favoriteId) {
        return favoriteId.toString() === id.toString();
    });
};

UserSchema.methods.follow = function (id) {
    if (this.following.indexOf(id) === -1) {
        this.following.push(id);
    }

    return this.save();
};

UserSchema.methods.unfollow = function (id) {
    this.following.remove(id);
    return this.save();
};

UserSchema.methods.isFollowing = function (id) {
    return this.following.some(function (followId) {
        return followId.toString() === id.toString();
    });
};

module.exports = mongoose.model('User', UserSchema);