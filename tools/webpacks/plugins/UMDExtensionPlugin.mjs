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
 *  Functions
 *
 * */


/**
 * @param {string} _
 * @param {string} amdPrefix
 * @param {string} amdRequires
 * @param {string} amdSuffix
 * @return {string}
 */
function convertAMD(_, amdPrefix, amdRequires, amdSuffix) {
    const requireToArgMap = {};
    const factoryArgs = [];

    amdRequires = amdRequires
        .replace(/^\[\[|\]\]$/gu, '')
        .split(/\],\s*?\[/gu);

    let factoryArg, // inner args
        pathItems,  // original args
        requireKey; // outer args

    for (const amdPath of amdRequires) {
        pathItems = amdPath
            .replace(/\[|\]/gu, '')
            .split(/,/gu);
        requireKey = pathItems.shift();
        factoryArg = requireToArgMap[requireKey];

        if (!factoryArg) {
            factoryArg = 'amd' + (Object.keys(requireToArgMap).length + 1);
            requireToArgMap[requireKey] = factoryArg;
        }

        factoryArgs.push(factoryArg + pathItems.map(pi => `[${pi}]`).join());
    }

    return (
        amdPrefix +
        `[${Object.keys(requireToArgMap).join(',')}], ` +
        `function (${Object.values(requireToArgMap).join(',')}) {` +
        `return factory(${factoryArgs});` +
        '})'
    );
}


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
            .replace(/\\/gu, '\\\\')
            .replace(/\$/gu, '\\$');

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
                        umdSuffix
                            .replace(
                                '(this,',
                                '(typeof window === \'undefined\' ?' +
                                ' this : window,'
                            )
                    ) : (
                        umdPrefix +
                        umdBridge
                            .replace(
                                /(define\(".*?", )(\[.*?\])(, factory\))/su,
                                convertAMD
                            )
                            .replace(
                                /require\(".*?"\)/gu,
                                `root["${nodeNamespaceReplacement}"]`
                            ) +
                        umdSuffix
                            .replace(
                                '(this,',
                                '(typeof window === \'undefined\' ?' +
                                ' this : window,'
                            )
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
