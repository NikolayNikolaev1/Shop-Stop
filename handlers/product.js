const url = require('url');
const database = require('../config/database');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '/database.json');
const qs = require('querystring');
const multiparty = require('multiparty');
const shortid = require('shortid');

function getProducts() {
    if (!fs.exists(dbPath)) {
        fs.writeFileSync(dbPath, '[]')
        return [];
    }

    let json = fs.readFileSync(dbPath).toString() || '[]';
    let products = json.parse(json);
    return products;
}

function saveProducts(products) {
    let json = JSON.stringify(products);
    fs.writeFileSync(dbPath, json);
}

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

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(data);
            res.end;
            return;
        })
    } else if (req.pathname === '/product/add' && req.method === 'POST') {
        let form = new multiparty.Form();
        let product = '';

        form.on('part', (part) => {
            if (part.filename) {
                let dataString = '';

                part.setEncoding('binary')
                part.on('data', (data) => {
                    dataString += data;
                });

                part.on('end', () => {
                    let fileName = shortid.generate();
                    let filePath = `content/images/${fileName}`;
                    product = qs.parse(dataString);

                    product.image = filePath
                    fs.writeFile(
                        `${filePath}`, dataString, {encoding: 'ascii'}, (err) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                });
            } else {
                part.setEncoding('utf-8');
                let field = '';
                part.on('data', (data) => {
                    field += data;
                });

                product = qs.parse(field);

                part.on('end', () => {
                    product[part.name] = field;
                });
            }
        });

        form.on('close', () => {
            database.products.add(product);
            res.writeHead(302, {
                Location: '/'
            });

            res.end();
        });
        
        form.parse(req);
    } else {
        return true;
    }
}

module.exports.products.getAll = getProducts;

module.exports.products.add = (product) => {
    let products = getProducts();
    product.id = products.length + 1;
    products.push(product);
    saveProducts(products);
}

module.exports.products.findByName = (name) => {
    return getProducts().filter(p => p.name.toLowerCase().includes(name));
}