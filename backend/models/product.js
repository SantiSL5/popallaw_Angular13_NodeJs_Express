const mongoose = require('mongoose');
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
    price: {
        type: Number,
        required: true
    }
}, { versionKey: false });

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
        price: this.price
    }
}

module.exports = mongoose.model("Product", ProductSchema);