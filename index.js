const http = require('http');
const url = require('url')
const port = 3000;
const handlers = require('./handlers');

let environment = process.env.NODE_ENV || "development";
const config = require('./config/config');
const database = require('./config/database');

database(config[environment]);

http
    .createServer((req,res) => {
        req.path = url.parse(req.url).pathname;
        for(let handler of handlers) {
            let next = handler(req,res);

            if(!next) {
                break;
            }
        }
    }).listen(port);

console.log(`Server running on ${port}`);