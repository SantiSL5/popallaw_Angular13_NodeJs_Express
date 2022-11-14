const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const slugf = require('slug');
const FormatSuccess = require('../utils/responseApi.js').FormatSuccess;
const FormatError = require('../utils/responseApi.js').FormatError;
const FormatObject = require('../utils/responseApi.js').FormatObject;

exports.createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.json(FormatObject(category));
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

exports.getCategories = async (req, res) => {
    try {
        limit=Number(req.query.limit);
        offset=Number(req.query.offset);
        const categories = await Category.find().limit(limit).skip(offset);
        res.json(FormatObject(categories));
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ "slug": req.params.slug });
        res.json(FormatObject(category));
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

function slugeo(cosa) {
    return slugf(cosa) + '-' + (Math.random() * Math.pow(36, 6) | 0);
}

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ "slug": req.params.slug });

        if (!category) {
            res.status(404).send(FormatError("Category not found", res.statusCode));
        } else {
            req.body.slug = slugeo(req.body.name);

            const newCategory = await Category.findOneAndUpdate({ "slug": req.params.slug }, req.body, { new: true });
            res.json(FormatSuccess("Category updated", newCategory));
        }
    } catch (error) {
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ "slug": req.params.slug });

        if (!category) {
            res.status(404).send(FormatError("Category not found", res.statusCode));
        } else {
            await Category.findOneAndRemove({ "slug": req.params.slug });
            res.json({ msg: "Category " + "'" + category.name + "'" + " deleted successfuly" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

