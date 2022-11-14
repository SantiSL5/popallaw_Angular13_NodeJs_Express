const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');
const slugf = require('slug');
const FormatSuccess = require('../utils/responseApi.js').FormatSuccess;
const FormatError = require('../utils/responseApi.js').FormatError;
const FormatObject = require('../utils/responseApi.js').FormatObject;

exports.paramsProduct = async (req, res, next, slug) => {
    Product.findOne({ "slug": slug })
        // .populate('author')
        .then(function (product) {
            if (!product) { return res.sendStatus(404); }

            req.product = product;

            return next();
        });
}

exports.paramsComment = async (req, res, next, id) => {
    Comment.findById(id).then(function (comment) {
        if (!comment) { return res.sendStatus(404); }

        req.comment = comment;

        return next();
    });
}

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
        queryfind = {};
        if (req.query.category != 'undefined' && req.query.category != undefined) queryfind.category = req.query.category;
        if (req.query.name != 'undefined' && req.query.name != undefined) queryfind.name = new RegExp('.*' + req.query.name + '*.', "i");
        if (req.query.priceMin != 'undefined' && req.query.priceMin != undefined && req.query.priceMax != 'undefined' && req.query.priceMax != undefined) {
            queryfind.price = { $gt: Number(req.query.priceMin) - 1, $lt: Number(req.query.priceMax) + 1 };
        }
        limit = Number(req.query.limit);
        offset = Number(req.query.offset);
        let products = await Product.find(queryfind).populate('categoryname').limit(limit).skip(offset);
        const numproducts = await Product.find(queryfind).populate('categoryname').count();

        if (products.length > 0) {

            if (req.payload) {
                await User.findById(req.payload.id).then(function (user) {
                    products = products.map(function (arrayProduct) {
                        return arrayProduct.toJSONFor(user);
                    });
                });

            }

            queryfind = {};
            if (req.query.category != 'undefined' && req.query.category != undefined) queryfind.category = req.query.category;
            if (req.query.name != 'undefined' && req.query.name != undefined) queryfind.name = new RegExp('.*' + req.query.name + '*.', "i");
            const pipeline = [
                { $match: queryfind },
                {
                    $project: {
                        "typeID": 1,
                        "highestPrice": "$price",
                        "lowestPrice": "$price"
                    }
                },
                {
                    "$group": {
                        "_id": "$typeID",
                        "highestPrice": { "$max": "$highestPrice" },
                        "lowestPrice": { "$min": "$lowestPrice" }
                    }
                },
            ];
            const prices = await Product.aggregate(pipeline);
            minprice = prices[0].lowestPrice;
            maxprice = prices[0].highestPrice;


        } else {
            minprice = 0;
            maxprice = 0;
        }

        res.json(FormatObject({ numproducts, products, minprice, maxprice }));

    } catch (error) {
        console.log(error);
        res.status(500).send(FormatError("Error occurred", res.statusCode));
    }
}

exports.getProduct = async (req, res) => {
    try {
        let product = await Product.findOne({ "slug": req.params.slug }).populate('categoryname');
        if (req.payload) {
            User.findById(req.payload.id).then(function (user) {
                product = product.toJSONFor(user);
                res.json(FormatObject(product));
            });
        }

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

exports.favProduct = async (req, res) => {
    var productId = req.product._id;

    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }

        return user.favorite(productId).then(function () {
            return req.product.updateFavoriteCount().then(function (product) {
                return res.json({ product: product.toJSONFor(user) });
            });
        });
    });
}

exports.unfavProduct = async (req, res) => {
    var productId = req.product._id;

    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }

        return user.unfavorite(productId).then(function () {
            return req.product.updateFavoriteCount().then(function (product) {
                return res.json({ product: product.toJSONFor(user) });
            });
        });
    });
}

exports.getComments = async (req, res) => {
    Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function (user) {
        return req.product.populate({
            path: 'comments',
            populate: {
                path: 'author'
            },
            options: {
                sort: {
                    createdAt: 'desc'
                }
            }
        })
            // .execPopulate()
            .then(function (product) {
                return res.json({
                    comments: req.product.comments.map(function (comment) {
                        return comment.toJSONFor(user);
                    })
                });
            });
    });
}

exports.addComment = async (req, res) => {
    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }

        var comment = new Comment();
        comment.product = req.product;
        comment.author = user;
        comment.body = req.body.body;

        return comment.save().then(function () {
            req.product.comments.push(comment);

            return req.product.save().then(function (product) {
                res.json({ comment: comment.toJSONFor(user) });
            });
        });
    });
}

exports.removeComment = async (req, res) => {
    if (req.comment.author.toString() === req.payload.id.toString()) {
        req.product.comments.remove(req.comment._id);
        req.product.save()
            .then(Comment.findOneAndRemove({ _id: req.comment._id }))
            .then(function () {
                res.sendStatus(204);
            });
    } else {
        res.sendStatus(403);
    }
}

