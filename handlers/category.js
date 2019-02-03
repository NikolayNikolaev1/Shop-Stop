const fs = require('fs');
const Category = require('../models/Category');

module.exports.addGet = (req, res) => {
    res.render('category/add');
}

module.exports.addPost = async (req, res) => {
    let category = req.body;
    await Category.create(category);
    res.redirect('/');
}