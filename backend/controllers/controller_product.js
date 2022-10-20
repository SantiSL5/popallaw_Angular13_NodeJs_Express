const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const slugf = require('slug');
const FormatSuccess = require('../utils/responseApi.js').FormatSuccess;
const FormatError = require('../utils/responseApi.js').FormatError;
const FormatObject = require('../utils/responseApi.js').FormatObject;
const category = require("../models/category");

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
        queryfind={};
        if (req.query.category != 'undefined' && req.query.category != undefined) queryfind.category=req.query.category;
        if (req.query.name != 'undefined' && req.query.name != undefined) queryfind.name=new RegExp('.*'+req.query.name+'*.',"i");
        
        limit=Number(req.query.limit);
        offset=Number(req.query.offset);
        const products = await Product.find(queryfind).populate('categoryname').limit(limit).skip(offset);
        const numproducts = await Product.find(queryfind).populate('categoryname').count();
        res.json(FormatObject({numproducts,products}));
    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ "slug": req.params.slug }).populate('categoryname');;
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
            res.status(404).send(FormatError("Product not found", res.statusCode));
        } else {
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