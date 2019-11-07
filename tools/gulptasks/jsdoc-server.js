/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');

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

const SOURCE_PATH = path.join(__dirname, '..', '..', 'build', 'api');

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

    const log = require('./lib/log');

    log.failure('404', p);

    response.writeHead(404);
    response.end('Ooops, the requested file is 404', 'utf-8');
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
function jsDocServer() {

    const fs = require('fs');
    const http = require('http');
    const log = require('./lib/log');

    return new Promise(resolve => {

        const port = 9005;

        http
            .createServer((request, response) => {

                let p = request.url;

                if (p === '/highcharts' || p === '/' || p === '') {
                    response302(response, '/highcharts/');
                    return;
                }
                if (p === '/highstock') {
                    response302(response, '/highstock/');
                    return;
                }
                if (p === '/highmaps') {
                    response302(response, '/highmaps/');
                    return;
                }
                if (request.method !== 'GET') {
                    response404(response, p);
                    return;
                }

                let file = path.basename(p);

                if (p[p.length - 1] === '/') {
                    file = 'index.html';
                } else {
                    file = path.basename(p);
                    p = path.dirname(p) + '/';
                }

                let ext = path.extname(file).substr(1);

                if (!MIMES[ext]) {
                    ext = 'html';
                    file += '.html';
                }

                // console.log(sourcePath + path + file);

                fs
                    .readFile(
                        SOURCE_PATH + p + file,
                        (error, data) => {
                            if (error) {
                                response404(response, (p + file));
                            } else {
                                response200(response, data, ext);
                            }
                        }
                    );
            })
            .listen(port);

        log.warn(
            'API documentation server running on http://localhost:' + port
        );

        resolve();
    });
}

gulp.task('jsdoc-server', jsDocServer);
