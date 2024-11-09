const fs = require("fs");
const path = require("path")

exports.serve = (req, res) => {
    // "/static/menu_images/cheeseburger.jpg"
    let filePath = req.url.split("/static/")[1]
    //console.log('Request for image ', filePath);
    filePath =  path.join(__dirname + `../../../public/${filePath}`)

    let extname = String(path.extname(filePath)).toLowerCase();
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm',
        '.ico' : 'image/x-icon'
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';
    
    //console.log(filePath)
    fs.readFile(filePath, function(error, content) {
        if (error) {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

}
