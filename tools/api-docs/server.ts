/* *
 *
 *  API Server Mockup
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


import Handlebars from 'handlebars';
import FS from 'node:fs/promises';
import HTTP from 'node:http';
import FSLib from '../libs/fs';
import TreeLib from '../libs/tree';
import Database from './database';


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

const PRODUCT_META = [
    {
        className: 'Highcharts',
        id: 'highcharts',
        name: 'Highcharts Core'
    },
    {
        className: 'Highcharts',
        id: 'highstock',
        name: 'Highcharts Stock'
    },
    {
        className: 'Highcharts',
        id: 'highmaps',
        name: 'Highcharts Maps'
    },
    {
        className: 'Highcharts',
        id: 'gantt',
        name: 'Highcharts Gantt'
    },
    {
        className: 'Dashboards',
        id: 'dashboards',
        name: 'Highcharts Dashboards'
    }
].reduce((obj, product) => {
    obj[product.id] = product;
    return obj;
}, {});

const STATIC_PATH = FSLib.path([__dirname, 'static']);


/* *
 *
 *  Functions
 *
 * */


async function getOption(
    database: Database,
    itemName: string = '',
    version?: number,
    forNavigation?: boolean
): Promise<TreeLib.Option> {
    const root = (
        forNavigation ?
            await getOption(database, '', version) :
            TreeLib.createTreeNode({}, '')
    );

    const node = await database.getItem(itemName, version);

    if (!node) {
        return root;
    }

    console.log(':', node.name);
    const option = (
        itemName ?
            TreeLib.createTreeNode(root.children, itemName) :
            root
    );

    option.doclet.description = node.description;

    if (node.deprecated) {
        option.doclet.deprecated = `${node.deprecated.toFixed(2)}.0`;
    }

    if (node.since) {
        option.doclet.since = `${node.since.toFixed(2)}.0`;
    }

    // Add direct children

    let childOption: TreeLib.Option;

    for (const child of await database.getItemChildren(itemName, version)) {
        console.log('>>>', child.name);

        childOption = TreeLib.createTreeNode(root.children, child.name);
        childOption.doclet.description = child.description;

        if (child.doclet.type) {
            childOption.doclet.type = {
                name: child.doclet.type.slice()
            };
        }

    }

    return (
        forNavigation ?
            root :
            option
    );
}


async function getNav(
    database: Database,
    itemName: string = '',
    version?: number
): Promise<Record<string, unknown>> {
    const item = await database.getItem(itemName, version);
    const nav = TreeLib.createTreeNode({}, itemName);

    if (item && item.name) {
        nav.doclet.description = item.description;
        nav.meta.fullname = item.name;
        nav.meta.name = item.name.split('.').pop();
    }

    let navChild: TreeLib.Option;
    let navChildren: TreeLib.Options = {};

    for (const childItem of await database.getItemChildren(itemName, version)) {
        if (childItem && childItem.name) {
            navChild = {
                doclet: {},
                meta: {
                    name: childItem.name.split('.').pop(),
                    fullname: childItem.name
                }
            }
            if (childItem.description) {
                navChild.doclet.description = childItem.description;
            }
            if (childItem.deprecated) {
                navChild.doclet.deprecated = `${childItem.deprecated}.0`;
            }
            if (childItem.since) {
                navChild.doclet.since = `${childItem.since}.0`;
            }
            navChildren[navChild.meta.name] = navChild;
        }
    }

    if (Object.keys(navChildren).length) {
        nav.children = navChildren;
    }

    return nav;
}


/**
 * Loads handlebar template and pending partials.
 *
 * @return
 * Promise of the template delegate to call with a context object.
 */
async function loadTemplate(): Promise<Handlebars.TemplateDelegate> {

    Handlebars.registerPartial(
        'server-sidebar', 
        await FS.readFile(
            FSLib.path([__dirname, 'templates/server-sidebar.handlebars']),
            'utf8'
        )
    );

    return Handlebars.compile(
        await FS.readFile(
            FSLib.path([__dirname, 'templates/server.handlebars']),
            'utf8'
        )
    );
}


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
 * @param path
 * Path to sanitize.
 *
 * @returns
 * Sanitized path.
 */
function sanitizePath(path: string): string {
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
 * Start a server for the API documentation.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function main() {

    const log = require('../libs/log');
    const template = await loadTemplate();

    HTTP
        .createServer(async (request, response) => {
            let path = sanitizePath(request.url);

            if (path === '/' || path === '') {
                response302(response, `/${Object.keys(PRODUCT_META)[0]}/`);
                return;
            }

            for (const productID of Object.keys(PRODUCT_META)) {
                if (path === `/${productID}`) {
                    response302(response, `/${productID}/`);
                    return;
                }
            }

            if (request.method !== 'GET') {
                response404(response, path);
                return;
            }

            try {
                if (path.startsWith('/static')) {
                    let file = (
                        path.endsWith('/') ?
                            'index.html' :
                            FSLib.lastPath(path)
                    );
                    let ext = file.split('.').pop();

                    if (!MIMES[ext]) {
                        ext = 'html';
                        file += '.html';
                    }

                    // console.log(sourcePath + path + file);

                    response200(
                        response,
                        await FS.readFile(`${STATIC_PATH}/${file}`, 'utf8'),
                        ext
                    );

                    return;
                }

                const product = path.split('/')[1];
                const option = path.split('/')[2];
                const database = new Database(`${product}_options`);

                if (option === 'nav') {
                    let navOption = path.split('/')[3];

                    console.log(database.product, navOption);

                    if (navOption.endsWith('.json')) {
                        navOption = navOption
                            .substring(0, navOption.length - 5);
                    }

                    response200(
                        response,
                        JSON.stringify(getNav(database, navOption)),
                        'json'
                    );

                    return;
                }

                console.log(database.product, option);

                response200(
                    response,
                    template({
                        option: {
                            name: option
                        },
                        product: PRODUCT_META[product],
                        side: await getOption(
                            database,
                            option,
                            void 0,
                            true
                        )
                    }),
                    'html'
                );
            } catch (error) {
                console.error(`${error}`);
                response404(response, path);
            }
        })
        .listen(PORT);

    log.warn(
        'API documentation server running on ',
        `http://localhost:${PORT}/dashboards/`
    );
}

main();
