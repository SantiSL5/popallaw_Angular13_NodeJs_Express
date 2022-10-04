const mongoose = require('mongoose');
const Category = require("../models/category");
const uniqueValitador = require('mongoose-unique-validator');
const slugf = require('slug');

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
    }
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

ProductSchema.methods.toJSONfor = function () {
    return {
        slug: this.slug,
        name: this.name,
        descrition: this.price,
        status: this.status,
        photo: this.photo,
        category: this.category,
        categoryname: this.categoryname,
        price: this.price
    }
}

module.exports = mongoose.model("Product", ProductSchema);