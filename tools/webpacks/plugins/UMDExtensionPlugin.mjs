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


import { updateFile } from '../../libs/fs.js';
import * as Path from 'node:path';


/* *
 *
 *  Constants
 *
 * */


const HOOKS_NAME = 'Highcharts.UMDExtensionPlugin';

const UMD_REGEXP = /(\(function webpackUniversalModuleDefinition\(root, factory\) \{\s+)(.*?)(\s+\}\)\(this, (?:function)?\()/su;

/* *
 *
 *  Functions
 *
 * */


/**
 * Converts AMD dependencies to arguments of the shared factory.
 *
 * @param {string} _
 * Complete AMD wrapper match.
 * @param {string} amdPrefix
 * Wrapper prefix before the dependency list.
 * @param {string} amdRequires
 * Dependencies passed to the factory.
 * @return {string}
 * Wrapper calling the factory with resolved dependencies.
 */
function convertAMD(_, amdPrefix, amdRequires) {
    const requireToArgMap = {};
    const factoryArgs = [];

    amdRequires = amdRequires
        .replace(/^\[\[|\]\]$/gu, '')
        .split(/\],\s*?\[/gu);

    let factoryArg, // inner args
        pathItems, // original args
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

        factoryArgs.push(factoryArg + pathItems.map(pi => `[${pi}]`).join(''));
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
     * Creates the plugin with the given options.
     *
     * @param {UMDExtensionPluginOptions} [options]
     * Plugin options.
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
        const productBundles = this.options.productBundles;
        const filename = Path.basename(outputOptions.filename || '');

        if (!filename) {
            return;
        }

        const filepath = Path.join(outputOptions.path, outputOptions.filename);

        updateFile(filepath, content => {
            const isES5 = filepath.includes('/es5/');

            const nodeNamespaceReplacement = '_' + content
                .match(/root\["(.*?)"\]/su)[1]
                .replace(/\\/gu, '\\\\')
                .replace(/\$/gu, '\\$');

            return content.replace(
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
                            )
                            .replace(
                                /define\("(.*?)", \[\], factory\)/su,
                                isES5 ?
                                    'define("$1", [], function() { return factory(); })' :
                                    'define("$1", [], factory)'
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
            );
        }, { optional: true });

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
