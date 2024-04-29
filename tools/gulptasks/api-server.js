/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

const FS = require('node:fs');

const HTTP = require('node:http');

const Path = require('node:path');

/* *
 *
 *  Constants
 *
 * */

const MIMES = {
    css: 'text/css',
    eot: 'application/vnd.ms-fontobject',
    js: 'application/javascript',
    json: 'application/json',
    html: 'text/html',
    ico: 'image/x-icon',
    png: 'image/png',
    svg: 'image/svg+xml',
    ttf: 'font/ttf',
    txt: 'text/plain',
    woff: 'font/woff',
    woff2: 'font/woff2',
    xml: 'application/xml'
};

const PATH_ESCAPE = /\.\.?\/|\/\.|\/\//u;

const PORT = 9005;

const SOURCE_PATH = Path.join(__dirname, '..', '..', 'build', 'api');

/* *
 *
 *  Functions
 *
 * */

/**
 * Response with a 200
 *
 * @param {ServerResponse} response
 *        HTTP response
 *
 * @param {Buffer} data
 *        File data
 *
 * @param {string} ext
 *        File extension
 *
 * @return {void}
 */
function response200(response, data, ext) {
    response.writeHead(200, { 'Content-Type': MIMES[ext] || MIMES.html });
    response.end(data);
}

/**
 * Response with a 302 - redirect
 *
 * @param {ServerResponse} response
 *        HTTP response
 *
 * @param {string} p
 *        Redirect path
 *
 * @return {void}
 */
function response302(response, p) {
    response.writeHead(302, { Location: p });
    response.end();
}

/**
 * Response with a 404 - not found
 *
 * @param {ServerResponse} response
 *        HTTP response
 *
 * @param {string} p
 *        Missing path
 *
 * @return {void}
 */
function response404(response, p) {

    const log = require('../libs/log');

    log.failure('404', p);

    response.writeHead(404);
    response.end('Ooops, the requested file is 404', 'utf-8');
}

/**
 * Removes path elements that could result in a folder escape.
 *
 * @param {string} path
 * Path to sanitize.
 *
 * @returns {string}
 * Sanitized path.
 */
function sanitizePath(path) {
    path = (new URL(path, 'http://localhost')).pathname;

    while (PATH_ESCAPE.test(path)) {
        path = path.replace(PATH_ESCAPE, '');
    }

    return path;
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * Start a server serving up the API documentation
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function apiServer() {

    const log = require('../libs/log');

    HTTP
        .createServer((request, response) => {

            let path = sanitizePath(request.url);

            if (path === '/highcharts' || path === '/' || path === '') {
                response302(response, '/highcharts/');
                return;
            }
            if (path === '/highstock') {
                response302(response, '/highstock/');
                return;
            }
            if (path === '/highmaps') {
                response302(response, '/highmaps/');
                return;
            }
            if (path === '/gantt') {
                response302(response, '/gantt/');
                return;
            }
            if (path === '/dashboards') {
                response302(response, '/dashboards/');
                return;
            }
            if (request.method !== 'GET') {
                response404(response, path);
                return;
            }

            let file = Path.basename(path);

            if (path[path.length - 1] === '/') {
                file = 'index.html';
            } else {
                file = Path.basename(path);
                path = Path.dirname(path) + '/';
            }

            let ext = Path.extname(file).substr(1);

            if (!MIMES[ext]) {
                ext = 'html';
                file += '.html';
            }

            // console.log(sourcePath + path + file);

            FS
                .readFile(
                    SOURCE_PATH + path + file,
                    (error, data) => {
                        if (error) {
                            response404(response, (path + file));
                        } else {
                            response200(response, data, ext);
                        }
                    }
                );
        })
        .listen(PORT);

    log.warn(
        'API documentation server running on http://localhost:' + PORT
    );
}

Gulp.task('api-server', apiServer);
