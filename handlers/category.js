const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const formidable = require('formidable');

const Category = require('../models/Category');

module.exports = (req, res) => {
    req.pathname = req.pathname || url.parse(req, url).pathname;

    if (req.pathname === '/category/add' && req.method === 'GET') {
        fs.readFile('./views/category/add.html', (err, data) => {
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
        });
    } else if (req.pathname === '/category/add' && req.method === 'POST') {
        let queryData = '';

        req.on('data', (data) => {
            queryData += data;
        });

        req.on('end', () => {
            let category = qs.parse(queryData);
            Category
                .create(category)
                .then(() => {
                    res.writeHead(302, {
                        location: '/'
                    });
                    res.end();
            }).catch((err) => {
                console.log(err.errors);
            });
        });
    } else {
        return true;
    }
}