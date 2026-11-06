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

const PORT = 9005;

/** Folders in the docs root that get a trailing-slash redirect */
const PRODUCTS = [
    'highcharts',
    'highstock',
    'highmaps',
    'gantt',
    'dashboards',
    'grid'
];

/** Root redirect per `--product` */
const PRODUCT_ROUTES = {
    Dashboards: '/dashboards/',
    Grid: '/grid/'
};

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

/* *
 *
 *  Tasks
 *
 * */

/**
 * Start a server serving up the API documentation
 *
 * @param {string} mainRoute
 * Route to redirect the docs root to.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function apiServer(mainRoute) {

    const log = require('../libs/log');
    const { sanitizePath } = require('../libs/fs');

    HTTP
        .createServer((request, response) => {

            let path = sanitizePath(request.url);

            if (path === '/') {
                response302(response, mainRoute);
                return;
            }

            if (PRODUCTS.includes(path.substring(1))) {
                response302(response, path + '/');
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
        .listen(PORT, '127.0.0.1');

    log.warn(
        'API documentation server running on http://localhost:' + PORT
    );
}

// Wrapped, so that Gulp does not pass its callback in as the main route
Gulp.task('api-server', () => apiServer(
    PRODUCT_ROUTES[require('yargs').argv.product] || '/highcharts/'
));
Gulp.task('dashboards/api-server', () => apiServer('/dashboards/'));
Gulp.task('jsdoc-server', () => apiServer('/highcharts/'));
