/* *
 *
 *  Modifies global namespace assignment to throw error 16.
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


const HOOKS_NAME = 'Highcharts.Error16Plugin';


/* *
 *
 *  Classes
 *
 * */


export class Error16Plugin {


    /* *
     *
     *  Constructor
     *
     * */


    /**
     * @param {Error16PluginOptions} [options]
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
     * @type {Error16PluginOptions}
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
            !productBundles.includes(filename)
        ) {
            return;
        }

        const filepath = Path.join(outputOptions.path, outputOptions.filename);
        const content = FS.readFileSync(filepath, 'utf8');

        FS.writeFileSync(
            filepath,
            content.replace(
                /((root\S+?) = factory\S+?);/su,
                '($2 && $2.error(16, true)) || ($1);'
            ),
            'utf8'
        );

    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Error16Plugin;


/* *
 *
 *  Types
 *
 * */


/**
 * @typedef {Object} Error16PluginOptions
 * @property {Array<string>} productBundles
 */
