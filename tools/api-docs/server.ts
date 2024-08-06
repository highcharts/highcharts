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
 *  Declarations
 *
 * */


interface Context extends Record<string, unknown> {
    node: TreeLib.Option;
    side: TreeLib.Option;
    platform: string;
    toc: Record<string, ContextTOCItem>
}


interface ContextTOCItem extends Record<string, unknown> {
    displayName: string;
}


interface Nav {
    children?: Array<Nav>;
    deprecated?: string;
    description?: string;
    filename?: string;
    fullname?: string;
    isLeaf?: boolean;
    name?: string;
    since?: string;
    typeList?: { names: Array<string> };
    version?: string;
}


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

const PRODUCT_META: Record<string, Record<string, string>> = [
    {
        constructor: 'chart',
        id: 'highcharts',
        module: 'highcharts',
        name: 'Highcharts Core',
        namespace: 'Highcharts'
    },
    {
        constructor: 'stockChart',
        id: 'highstock',
        module: 'highstock',
        name: 'Highcharts Stock',
        namespace: 'Highcharts'
    },
    {
        constructor: 'mapChart',
        id: 'highmaps',
        module: 'highmaps',
        name: 'Highcharts Maps',
        namespace: 'Highcharts'
    },
    {
        constructor: 'ganttChart',
        id: 'gantt',
        module: 'highcharts-gantt',
        name: 'Highcharts Gantt',
        namespace: 'Highcharts'
    },
    {
        constructor: 'board',
        id: 'dashboards',
        module: 'dashboards',
        name: 'Highcharts Dashboards',
        namespace: 'Dashboards',
        noClassReference: true,
        noGlobalOptions: true
    }
].reduce((obj, product) => {
    obj[product.id] = product;
    return obj;
}, {});

const STATIC_PATH = FSLib.path([__dirname, 'static-server']);


/* *
 *
 *  Functions
 *
 * */


async function getContext(
    database: Database,
    itemName: string = '',
    version?: number
): Promise<Context> {
    const node = await getOption(database, itemName, version);
    const productMeta = PRODUCT_META[database.product];
    const side = await getOption(database, itemName, version, true);
    console.log(node);
    return {
        constr: productMeta.constructor,
        date: (new Date()).toISOString().substring(0, 19).replace('T', ''),
        node,
        side,
        platform: 'JS',
        product: productMeta,
        productModule: productMeta.module,
        productName: productMeta.name,
        toc: await getContextTOC(database)
    } as Context;
}


async function getContextTOC(
    database: Database
) {
    const toc: Record<string, ContextTOCItem> = {};

    let tocItem: ContextTOCItem;
    let tocMeta: Record<string, string>;

    for (const key of Object.keys(PRODUCT_META)) {
        tocMeta = PRODUCT_META[key];
        tocItem = {
            active: key === database.product,
            displayName: tocMeta.name
        };
        toc[key] = tocItem;
    }

    return toc;
}


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
        console.log('X', itemName);
        return root;
    }

    console.log(':', itemName);

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
): Promise<Nav> {
    itemName = (itemName === 'index' ? '' : itemName);

    const item = await database.getItem(itemName, version);
    const nav: Nav = (item ? toNav(item) : {});

    let navChildren: Array<Nav> = [];

    for (const childItem of await database.getItemChildren(itemName, version)) {
        if (childItem && childItem.name) {
            navChildren.push(toNav(childItem));
        }
    }

    if (navChildren.length) {
        nav.children = navChildren;
    }

    return nav;
}


function toNav(item: Database.Item): Nav {
    const nav: Nav = {};

    if (item.description) {
        nav.description = item.description;
    }
    if (item.meta.file) {
        nav.filename = item.meta.file;
    }
    nav.fullname = item.name;
    nav.name = item.name.split('.').pop();
    if (item.doclet.type) {
        nav.isLeaf = item.doclet.type
            .every(type => type[0] === type[0].toLowerCase());
        nav.typeList = { names: item.doclet.type };
    }

    return nav;
}


/**
 * Loads new handlebar template and pending partials.
 *
 * @return
 * Promise of the template delegate to call with a context object.
 */
async function loadServerTemplate(): Promise<Handlebars.TemplateDelegate> {

    // Handlebars.registerPartial(
    //     'server-sidebar', 
    //     await FS.readFile(
    //         FSLib.path([__dirname, 'templates/server-sidebar.handlebars']),
    //         'utf8'
    //     )
    // );

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
    const template = await loadServerTemplate();

    HTTP
        .createServer(async (request, response) => {
            let path = sanitizePath(request.url);

            if (path === '/' || path === '') {
                response302(response, `/${Object.keys(PRODUCT_META)[0]}/`);
                return;
            }

            if (PRODUCT_META[path.substring(1)]) {
                response302(response, `${path}/`);
                return;
            }

            if (request.method !== 'GET') {
                response404(response, path);
                return;
            }

            try {
                const pathItems = path.substring(1).split('/');

                let product =  pathItems[0];
                let option = pathItems.slice(1).join('/');

                const database = new Database(product);

                let file = FSLib.lastPath(option);
                let ext = file.split('.').pop();

                console.log([product, option, file, ext]);

                switch (ext) {
                    case '':
                    case 'html':
                        response200(
                            response,
                            template(await getContext(database, option)),
                            'html'
                        );
                        return;
                    case 'json':
                        if (!option.startsWith('nav/')) {
                            throw new Error();
                        }
                        file = file.substring(0, file.length - ext.length - 1);
                        response200(
                            response,
                            JSON.stringify(
                                await getNav(database, file),
                                void 0,
                                '\t'
                            ),
                            'json'
                        );
                        return;
                    default:
                        if (product !== 'static') {
                            throw new Error();
                        }
                        response200(
                            response,
                            await FS.readFile(
                                `${STATIC_PATH}/${file}`,
                                'utf8'
                            ),
                            ext
                        );
                        return;
                }

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
