const http = require('http');
const handlers = require('./handlers');
const url = require('url')
const port = 3000;

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

