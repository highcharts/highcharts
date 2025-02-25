/* *
 *
 *  Replace Highcharts product tags with meta information.
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


/* *
 *
 *  Imports
 *
 * */


import * as FS from 'node:fs';
import * as Path from 'node:path';
import Webpack from 'webpack';


/* *
 *
 *  Constants
 *
 * */


const HEADER_PATTERN = /\/\*\*[\s]+\*[\s]+@license.*?\*\//su;


const HOOKS_NAME = 'Highcharts.ProductMetaPlugin';


/* *
 *
 *  Classes
 *
 * */


export class ProductMetaPlugin {


    /* *
     *
     *  Constructor
     *
     * */


    /**
     * @param {ProductMetaPluginOptions} [options]
     */
    constructor(options = {}) {
        options = this.options = {
            assetPrefix: '',
            productDate: new Date().toISOString().substring(0 , 10),
            ...options
        };

        if (
            options.productName &&
            options.productVersion ||
            !FS.existsSync('package.json')
        ) {
            return;
        }

        const packageJSON = JSON.parse(FS.readFileSync('package.json'));

        options.productName = (
            options.productName ||
            packageJSON.name
        );

        if (
            !options.productVersion &&
            FS.existsSync('build-properties.json')
        ) {
            const buildPropertiesJSON =
                JSON.parse(FS.readFileSync('build-properties.json'));

            options.productVersion = (
                options.productVersion ||
                buildPropertiesJSON.version
            );
        }

        options.productVersion = (
            options.productVersion ||
            packageJSON.version
        );

    }


    /* *
     *
     *  Properties
     *
     * */


    /**
     * @type {ProductMetaPluginOptions}
     */
    options;


    /* *
     *
     *  Functions
     *
     * */


    /**
     * @param {Webpack.Compiler} compiler 
     */
    apply(compiler) {
        compiler.hooks.done.tap(HOOKS_NAME, (stats) => this.onDone(stats));
    }


    /**
     * @param {Webpack.Stats} stats
     */
    onDone(stats) {
        const compilation = stats.compilation;
        const outputOptions = compilation.options.output;
        const filename = Path.basename(outputOptions.filename || '');

        if (Path.extname(filename) !== '.js') {
            return;
        }

        const options = this.options;
        const filepath = Path.join(outputOptions.path, outputOptions.filename);

        if (!FS.existsSync(filepath)) {
            return;
        }

        let content = FS.readFileSync(filepath, 'utf8');
        let productMatch = content.indexOf('@product.');
        let headerMatch = content.match(HEADER_PATTERN);

        if (
            headerMatch?.index < 80 &&
            productMatch < 0
        ) {
            return;
        }

        if (headerMatch?.index > 80) {
            content = (
                headerMatch[0] + '\n' +
                content.substring(0, headerMatch.index) +
                content.substring(headerMatch.index + headerMatch[0].length)
            );
        }

        if (productMatch >= 0) {
            content = content
                .replace(/@product\.name@/gu, () => options.productName)
                .replace(/@product\.version@/gu, () => options.productVersion)
                .replace(/@product\.assetPrefix@/gu, () => options.assetPrefix)
                .replace(/@product\.date@/gu, () => options.productDate);
        }


        FS.writeFileSync(filepath, content, 'utf8');

    }


}


/* *
 *
 *  Default Export
 *
 * */


export default ProductMetaPlugin;


/* *
 *
 *  Types
 *
 * */


/**
 * @typedef {object} ProductMetaPluginOptions
 * @property {string} [assetPrefix]
 * @property {string} [productDate]
 * @property {string} [productName]
 * @property {string} [productVersion]
 */
