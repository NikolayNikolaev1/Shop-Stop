const fs = require('fs');
const path = require('path');

const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports.addGet = (req, res) => {
    Category
        .find()
        .then((categories) => {
            res.render('product/add', {categories: categories});
    });
}

module.exports.addPost = async (req, res) => {
    let productObj = req.body;
    productObj.image = req.file.destination + '\\' + req.file.originalname;
    productObj.creator = req.user._id;

    let product = await Product.create(productObj);
    let category = await Category.findById(product.category);
    category.products.push(product._id);
    category.save();
    res.redirect('/');
}

module.exports.editGet = (req, res) => {
    let id = req.params.id;
    Product
        .findById(id)
        .then(product => {
            if (!product) {
                res.sendStatus('404');
                return;
            }

            Category
                .find()
                .then((categories) => {
                    res.render('product/edit', {
                        product,
                        categories
                    });
                });
        });
}

module.exports.editPost = (req, res) => {
    let id = req.params.id;
    let editedProduct = req.body;

    Product
        .findById(id)
        .then((product) => {
            if (!product) {
                res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`);
                return;
            }

            if (product.creator.equals(req.user._id) || req.user.roles.indexOf('Admin') >= 0) {
                product.name = editedProduct.name;
                product.description = editedProduct.description;
                product.price = editedProduct.price;

                if (req.file) {
                    product.image = '\\' + req.file.path;
                }

                if (product.category.toString() !== editedProduct.category) {
                    Category
                        .findById(product.category)
                        .then((currentCategory) => {
                            Category.findById(editedProduct.category).then((nextCategory) => {
                                let index = currentCategory.products.indexOf(product._id);
                                if (index >= 0) {
                                    currentCategory.products.splice(index, 1);
                                }
                                currentCategory.save();

                                nextCategory.products.push(product._id);
                                nextCategory.save();

                                product.category = editedProduct.category;

                                product.save().then(() => {
                                    res.redirect('/?success=' + encodeURIComponent('Product was edited successfully'));
                                })
                        })
                    })
                } else {
                    product.save().then(() => {
                        res.redirect('/?success=' + encodeURIComponent('Product was edited successfully'));
                    })
                }
        } else {
            res.redirect(`/?error=${encodeURIComponent('You cannot edit this product!')}`);
        }
    })
}