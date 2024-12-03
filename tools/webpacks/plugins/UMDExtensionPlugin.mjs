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


const UMD_REGEXP = /(\(function webpackUniversalModuleDefinition\(root, factory\) \{\s+)(.*?)(\s+\}\)\(this, \()/su;


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

        if (!filename) {
            return;
        }

        const filepath = Path.join(outputOptions.path, outputOptions.filename);
        const content = FS.readFileSync(filepath, 'utf8');

        const nodeNamespaceReplacement = '_' + content
            .match(/root\["(.*?)"\]/su)[1]
            .replace('$', '\\$');

        FS.writeFileSync(
            filepath,
            content.replace(
                UMD_REGEXP,
                (_, umdPrefix, umdBridge, umdSuffix) => (
                    productBundles.includes(filename) ? (
                        umdPrefix +
                        umdBridge
                            .replace(
                                /(module\.exports = )factory\(\);/su,
                                '(' +
                                `root["${nodeNamespaceReplacement}"] = factory()` +
                                `,$1root["${nodeNamespaceReplacement}"]` +
                                ');'
                            )
                            .replace(
                                /(exports\[".*?"\] = )factory\(\);/su,
                                '(' +
                                `root["${nodeNamespaceReplacement}"] = factory()` +
                                `,$1root["${nodeNamespaceReplacement}"]` +
                                ');'
                            ) +
                        umdSuffix.replace('(this,', '(typeof window === \'undefined\' ? this : window,')
                    ) : (
                        umdPrefix +
                        umdBridge
                            .replace(
                                /require\(".*?"\)/gu,
                                `root["${nodeNamespaceReplacement}"]`
                            ) +
                        umdSuffix.replace('(this,', '(typeof window === \'undefined\' ? this : window,')
                    )
                )
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
