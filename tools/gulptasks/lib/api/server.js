/* eslint-disable require-jsdoc */

// Dependencies sorted by require path
const fs = require('fs');
const http = require('http');
const { parse, resolve } = require('path');
const { promisify } = require('util');

/* Create promise versions of utility functions
 * Note: Consider e.g require('fs').promises, if limiting support to NodeJS v10
 * and above. */
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

// Constants
const { argv } = process;
const PORT = Number(argv[(argv.indexOf('--port') + 1)]) || 8080;
const BASE = `http://localhost:${PORT}`;
const PRODUCT = ['highcharts', 'highstock', 'highmaps', 'gantt'].find(
    product => {
        try {
            fs.statSync(resolve(__dirname, product));
            return true;
        } catch {
            return false;
        }
    }
);
const MIME_TYPE = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

function log(str) {
    console.log(str); // eslint-disable-line no-console
}

function fileExists(path) {
    return stat(path)
        .then(stats => (stats.isFile() ?
            path :
            Promise.reject(new Error(`no such file ${path}`))
        ));
}

function get404Handler(response) {
    return e => {
        response.writeHead(404, {});
        response.end(`404: ${e.message}`, 'utf-8');
    };
}

function get200Handler(response) {
    return path => readFile(path)
        .then(data => {
            const { ext } = parse(path);
            response.writeHead(200, {
                'Content-type': MIME_TYPE[ext] || 'text/plain'
            });
            response.end(data, 'utf-8');
        });
}

function getRewriteHandler(response) {
    const rewrites = {
        '': `/${PRODUCT}/`,
        '/': `/${PRODUCT}/`,
        '/gantt': '/gantt/',
        '/highcharts': '/highcharts/',
        '/highstock': '/highstock/',
        '/maps': '/maps/'
    };
    return url => {
        const rewrite = rewrites[url];
        if (rewrite) {
            response.writeHead(301, {
                Location: rewrite
            });
            response.end();
            return false;
        }
        return true;
    };
}

http.createServer((request, response) => {
    const handle404 = get404Handler(response);
    const handle200 = get200Handler(response);
    const handleRewrites = getRewriteHandler(response);
    const url = new URL(request.url, BASE).pathname;
    if (handleRewrites(url)) {
        const { ext } = parse(url);
        const isDirectory = url.endsWith('/');
        const filepath = resolve(
            __dirname,
            `.${url}${!isDirectory && !MIME_TYPE[ext] ? '.html' : ''}`,
            (isDirectory ? 'index.html' : '')
        );
        return fileExists(filepath)
            .then(handle200)
            .catch(handle404);
    }
    return Promise.resolve();
}).listen(PORT);

log(`API available at ${BASE}/${PRODUCT}/`);
