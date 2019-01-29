const url = require('url');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const qs = require('querystring');
const multiparty = require('multiparty');
const shortid = require('shortid');

const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = (req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname === '/product/add' && req.method === 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, '../views/products/add.html'))

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                res.write('404 not found!');
                res.end();
                return;
            }

            Category
                .find()
                .then((categories) => {
                    let replacement = `<select class="input-fields" name="category">`;

                    for (let category of categories) {
                        replacement += `<option value="${category._id}">${category.name}</option>`;
                    }

                    replacement += `</select>`;

                    let html = data.toString().replace('{{categories}}', replacement);

                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    
                    res.write(html);
                    res.end();
                });

            // res.writeHead(200, {
            //     'Content-Type': 'text/html'
            // });

            // res.write(data);
            // res.end;
            // return;
        })
    } else if(req.path === '/product/add' && req.method === 'POST'){
        let form = formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
            console.log(err);
            return;
        }

        // let fileName = shortid.generate();
        // let filePath = `content/images/${fileName}`;
        // product = qs.parse(dataString);

        // product.image = filePath
        // fs.writeFile(
        //     `${filePath}`, dataString, {encoding: 'ascii'}, (err) => {
        //         if (err) {
        //             console.log(err);
        //             return;
        //         }
        //     });

        let name = fields.name;
        let description = fields.description;
        let price = fields.price;
        let image = fields.image;

        Product
            .create({
                name: name,
                description: description,
                price: price,
                image: image,
            })
            .then(() => {
                res.writeHead(302, {
                location: '/'
                });
                res.end();
            })
            .catch((err) => {
                console.log(err.errors);
            });

        });

    }
    // else if (req.pathname === '/product/add' && req.method === 'POST') {
    //     let form = new multiparty.Form();
    //     let product = '';

    //     form.on('part', (part) => {
    //         if (part.filename) {
    //             let dataString = '';

    //             part.setEncoding('binary')
    //             part.on('data', (data) => {
    //                 dataString += data;
    //             });

    //             part.on('end', () => {
    //                 let fileName = shortid.generate();
    //                 let filePath = `content/images/${fileName}`;
    //                 product = qs.parse(dataString);

    //                 product.image = filePath
    //                 fs.writeFile(
    //                     `${filePath}`, dataString, {encoding: 'ascii'}, (err) => {
    //                         if (err) {
    //                             console.log(err);
    //                             return;
    //                         }
    //                     });
    //             });
    //         } else {
    //             part.setEncoding('utf-8');
    //             let field = '';
    //             part.on('data', (data) => {
    //                 field += data;
    //             });

    //             product = qs.parse(field);

    //             part.on('end', () => {
    //                 product[part.name] = field;
    //             });
    //         }
    //     });

    //     form.on('end', () => {
    //         let product = qs.parse(dataString);

    //         Product.create(product).then(() => {
    //             res.writeHead(302, {
    //                 Location: '/'
    //             });
    //         })

    //         res.end();
    //     });
        
    //     form.parse(req);
    // } 
    else {
        return true;
    }
}