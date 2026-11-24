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
import { updateFile } from '../../libs/fs.js';


/* *
 *
 *  Constants
 *
 * */


const HEADER_PATTERN = /(?:\/\/[^\S\r\n]*SPDX-License-Identifier:[^\S\r\n]*LicenseRef-Highcharts[^\S\r\n]*\r?\n)?\/\*!?\*[\s]+\*[\s]+@license[\s\S]*?\*\//gsu;


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
     * Creates the plugin with the given options.
     *
     * @param {ProductMetaPluginOptions} [options]
     * Plugin options.
     */
    constructor(options = {}) {
        options = this.options = {
            assetPrefix: '',
            productDate: new Date().toISOString().substring(0, 10),
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
     * Registers the output processing hook.
     *
     * @param {import('webpack').Compiler} compiler
     * Webpack compiler.
     */
    apply(compiler) {
        compiler.hooks.done.tap(HOOKS_NAME, stats => this.onDone(stats));
    }


    /**
     * Updates the emitted bundle after compilation.
     *
     * @param {import('webpack').Stats} stats
     * Compilation statistics.
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

        // Use one file descriptor for reading and writing so replacing the
        // pathname between these steps cannot redirect writes to another file.
        updateFile(filepath, content => {
            const productMatch = content.indexOf('@product.');
            // Use the last match - should be the one from ts/masters.
            const headerMatch = [...content.matchAll(HEADER_PATTERN)].at(-1);

            if (
                headerMatch?.index < 80 &&
                productMatch < 0
            ) {
                return void 0;
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


            return content;
        }, { optional: true });

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
