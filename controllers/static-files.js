const fs = require('fs');
const path = require('path');
const url = require('url');

function getContentType(url){
    let contentType = 'text/plain';

    if(url.endsWith('.css')){
        contentType = 'text/css';
    }else if(contentType.endsWith('.js')){
        contentType = 'application/javascript';
    }

    return contentType;
}

module.exports = (req,res) => {
  if(req.path.startsWith('/content') && req.method === 'GET'){
    fs.readFile(`.${req.path}`, (err,data) => {
        if(err){
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.write('Resources not found!');
            res.end();
            return;
        }

        res.writeHead(200, {
            'Content-Type':getContentType(req.path)
        });
        res.write(data);
        res.end();
    });
  }else {
      return true;
  }
};