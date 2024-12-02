/* *
 *
 *  Modifies UMD pattern to allow extensions on shared namespace.
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


const HOOKS_NAME = 'Highcharts.UMDExtensionPlugin';


/* *
 *
 *  Classes
 *
 * */


export class UMDExtensionPlugin {


    /* *
     *
     *  Constructor
     *
     * */


    /**
     * @param {UMDExtensionPluginOptions} [options]
     */
    constructor(options = {}) {
        this.options = options;
    }


    /* *
     *
     *  Properties
     *
     * */


    /**
     * @type {UMDExtensionPluginOptions}
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
        const productBundles = this.options.productBundles;
        const filename = Path.basename(outputOptions.filename || '');

        if (
            !filename ||
            productBundles.includes(filename)
        ) {
            return;
        }

        const filepath = Path.join(outputOptions.path, outputOptions.filename);
        const content = FS.readFileSync(filepath, 'utf8');

        FS.writeFileSync(
            filepath,
            content.replace(/(?<=else\s+)root\[\S+?\] = (factory\(root\[.+?\));/su, '$1;'),
            'utf8'
        );

    }


}


/* *
 *
 *  Default Export
 *
 * */


export default UMDExtensionPlugin;


/* *
 *
 *  Types
 *
 * */


/**
 * @typedef {Object} UMDExtensionPluginOptions
 * @property {Array<string>} productBundles
 */
