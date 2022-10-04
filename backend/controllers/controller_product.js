const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const slugf = require('slug');
const FormatSuccess = require('../utils/responseApi.js').FormatSuccess;
const FormatError = require('../utils/responseApi.js').FormatError;
const FormatObject = require('../utils/responseApi.js').FormatObject;

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json(FormatObject(product));
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(FormatObject(products));
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ "slug": req.params.slug });
        res.json(FormatObject(product));
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

function slugeo(cosa) {
    return slugf(cosa) + '-' + (Math.random() * Math.pow(36, 6) | 0);
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ "slug": req.params.slug });

        if (!product) {
            res.status(404).send(FormatError("Product not found", res.statusCode));        } else {
            req.body.slug = slugeo(req.body.name);

            const newProduct = await Product.findOneAndUpdate({ "slug": req.params.slug }, req.body, { new: true });
            res.json(FormatSuccess("Product updated", newProduct));
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ "slug": req.params.slug });

        if (!product) {
            res.status(404).send(FormatError("Product not found", res.statusCode));
        } else {
            await Product.findOneAndRemove({ "slug": req.params.slug });
            res.json(FormatSuccess("Product " + "'" + product.name + "'" + " deleted successfuly"));
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}