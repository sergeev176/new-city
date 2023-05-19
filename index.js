

import http from 'http';
import fs from 'fs';



function getMimeType(path) {
    let mimes = {
        html: 'text/html',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        json: 'application/json',
        js: 'text/javascript',
        css: 'text/css',
        ico: 'image/x-icon',
    };

    let exts = Object.keys(mimes);
    let extReg = new RegExp('\\.(' + exts.join('|') + ')$');

    let ext = path.match(extReg)[1];

    if (ext) {
        return mimes[ext];
    } else {
        return 'text/plain';
    }
}

http.createServer(async (request, response) => {

    if (request.url !== '/favicon.ico') {

        // let url = request.url

        let lpath = 'root/layout.html';
        let layout = await fs.promises.readFile(lpath, 'utf8')

        let tpath, cpath
        let title, content
        let error, data

        let path = 'root/pages' + request.url

        try {
            if ((await fs.promises.stat(path)).isDirectory()) {
                
                tpath = path + '/title.html'
                title = await fs.promises.readFile(tpath, 'utf8')
                
                cpath = path + '/content.html'
                content = await fs.promises.readFile(cpath, 'utf8')
                
                layout = layout.replace(/\{% get title %\}/, title);
                layout = layout.replace(/\{% get content %\}/, content);
                
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(layout);
                
            } else {
                
                data = await fs.promises.readFile(path);
                response.writeHead(200, { 'Content-Type': getMimeType(path) });
                response.write(data);
            }

        } catch {
            error = await fs.promises.readFile('root/404.html', 'utf8')

            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.write(error);
        }

        response.end();
    }
}).listen(3000);




