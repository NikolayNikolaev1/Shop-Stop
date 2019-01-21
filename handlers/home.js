const url = require('url');
const fs = require('fs');
const path = require('path');
const database = require('../config/database');
const qs = require('querystring');

module.exports = (req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname === '/' && req.method === 'GET') {
        // "path" module is just utility module for editing file paths
        let filePath = path.normalize(
            path.join(__dirname, '../views/home/index.html'));

        fs.readFile(filePath, (err, data) =>{
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

            let queryData = qs.parse(url.parse(req.url).query);
            let products = database.products.getAll();
            let content = '';

            if (queryData.query) {
                products = database.products.filter(product => product.name === queryData.name);
            }
            
            for (let product of products) {
                //TODO: fix this..
                content += 
                `<div class="product-card">
                    <img class="product-img" src="${product.image}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                </div>`
            }

            let html = data.toString().replace('{content}', content);

            res.write(html);
            res.end;
            return;
        });
    } else {
        return true;
    }
}