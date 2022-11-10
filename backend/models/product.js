const mongoose = require('mongoose');
// const Category = require("../models/category");
const uniqueValitador = require('mongoose-unique-validator');
const slugf = require('slug');
let User = mongoose.model('User');

const ProductSchema = mongoose.Schema({
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    descrition: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
});

ProductSchema.virtual('categoryname', {
    ref: 'Category',
    localField: 'category',
    foreignField: 'slug',
    justOne: true
})

ProductSchema.plugin(uniqueValitador, { message: "is already taken" });

ProductSchema.pre("validate", function (next) {
    if (!this.slug) {
        this.slugify();
    }
    next();
});

ProductSchema.methods.slugify = function () {
    this.slug = slugf(this.name) + "-" + (Math.random() * Math.pow(36, 6) | 0);
};

ProductSchema.methods.updateFavoriteCount = function () {
    var product = this;

    return User.count({ favorites: { $in: [product._id] } }).then(function (count) {
        product.favoritesCount = count;

        return product.save();
    });
};

ProductSchema.methods.toJSONFor = function (user) {
    return {
        slug: this.slug,
        name: this.name,
        descrition: this.price,
        status: this.status,
        photo: this.photo,
        category: this.category,
        categoryname: this.categoryname,
        favorited: user ? user.isFavorite(this._id) : false,
        favoritesCount: this.favoritesCount,
        price: this.price,
        author: this.author.toProfileJSONFor(user)
    }
}

module.exports = mongoose.model("Product", ProductSchema);