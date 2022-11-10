const mongoose = require('mongoose');
const uniqueValitador = require('mongoose-unique-validator');
const slugf = require('slug');

const CategorySchema = mongoose.Schema({
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    }
}, { versionKey: false });


CategorySchema.plugin(uniqueValitador, { message: 'is already taken' });

CategorySchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slugify();
    }
    next();
});

CategorySchema.methods.slugify = function () {
    this.slug = slugf(this.name) + '-' + (Math.random() * Math.pow(36, 6) | 0);
};

CategorySchema.methods.toJSONFor = function (category) {
    return {
        slug: category.slug,
        name: category.name,
        photo: category.photo
    }
}

module.exports = mongoose.model('Category', CategorySchema);