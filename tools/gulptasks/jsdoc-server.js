/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const MIMES = {
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    html: 'text/html',
    ico: 'image/x-icon',
    png: 'image/png',
    svg: 'image/svg+xml',
    xml: 'application/xml'
};

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
 * @param {string} path
 *        Redirect path
 *
 * @return {void}
 */
function response302(response, path) {
    response.writeHead(302, { Location: path });
    response.end();
}

/**
 * Response with a 404 - not found
 *
 * @param {ServerResponse} response
 *        HTTP response
 *
 * @return {void}
 */
function response404(response) {
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
function task() {

    const FS = require('fs');
    const HTTP = require('http');
    const LogLib = require('./lib/log');
    const Path = require('path');
    const URL = require('url');

    return new Promise(resolve => {

        const port = 9005;
        const sourcePath = Path.join(__dirname, 'build', 'api');

        HTTP
            .createServer((request, response) => {

                // eslint-disable-next-line node/no-deprecated-api
                const path = URL.parse(request.url, true).pathname;

                let redirect = false;

                if (path === '/highcharts' || path === '/' || path === '') {
                    redirect = '/highcharts/';
                } else if (path === '/highstock') {
                    redirect = '/highstock/';
                } else if (path === '/highmaps') {
                    redirect = '/highmaps/';
                }

                if (redirect) {
                    response302(redirect);
                    return;
                }

                if (request.method !== 'GET') {
                    response404(response);
                    return;
                }

                const file = (Path.basename(path) || 'index.html');

                FS
                    .readFile(
                        sourcePath + Path.dirname(path) + file,
                        (error, data) => {
                            if (error) {
                                response404(response);
                            } else {
                                response200(
                                    response, data, Path.extname(file).substr(1)
                                );
                            }
                        }
                    );
            })
            .listen(port);

        LogLib.warn(
            'API documentation server running on http://localhost:' + port
        );

        resolve();
    });
}

Gulp.task('jsdoc-server', task);
