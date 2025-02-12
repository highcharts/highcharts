/* *
 *
 *  Adds dynamic mapping of externals based on master files (root module).
 *  DO NOT EDIT! Change `externals.json` for adjustments.
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


import Path from 'node:path';
import FSLib from '../libs/fs.js';


/* *
 *
 *  Constants
 *
 * */


/** @type {ExternalsJSON} */
const externals =
    FSLib.getFile(FSLib.path([import.meta.dirname, 'externals.json']), true);


/* *
 *
 *  Functions
 *
 * */


/**
 * Creates a configuration to resolve an external reference via the given path.
 *
 * @param {string} namespace
 * Shared namespace between masters.
 *
 * @param  {...Array<string>} pathMembers
 * Path to resolve to.
 *
 * @returns 
 * UMD configuration.
 */
function createUMDConfig(namespace, ...pathMembers) {
    const namespaceLC = namespace.toLowerCase();
    const commonjs = [namespaceLC, ...pathMembers];
    return {
        amd: [`${namespaceLC}/${namespaceLC}`, ...pathMembers],
        commonjs,
        commonjs2: commonjs,
        root: [namespace, ...pathMembers]
    };
}


/**
 * Creates external references for masters. It can make secondary product
 * bundles a relay to other bundles and the primary product bundle. This helps
 * to avoid multiple namespace instances in ESM.
 *
 * @param {*} info
 * Webpack reference information.
 *
 * @param {string} masterName
 * Master name that gets bundled.
 *
 * @param {string} mastersFolder
 * Source folder with masters.
 *
 * @param {string} namespace
 * Shared namespace.
 *
 * @param {string} [externalsType]
 * Externals type to consider.
 *
 * @return {unknown}
 * Config for external reference, or `undefined` to include reference in bundle.
 */
export async function makeExternals(
    info,
    masterName,
    mastersFolder,
    namespace,
    externalsType = 'umd'
) {
    const path = Path
        .relative(mastersFolder, Path.join(info.context, info.request))
        .replaceAll(Path.sep, Path.posix.sep);
    const namespaceName = Path
        .basename(path)
        .replace(/(?:\.src)?\.js$/su, '');

    if (
        namespaceName === masterName ||
        path.startsWith('../') // Include; not a bundle master.
    ) {
        return void 0;
    }

    switch (externalsType) {
        case 'module-import':
            return `${externalsType} ${path}`;
        case 'umd':
            return createUMDConfig(namespace, namespaceName);
        default:
            return {
                [externalsType]: [namespace, namespaceName]
            };
    }
}


/**
 * Resolves external references.
 *
 * @param {*} info
 * Webpack reference information.
 *
 * @param {string} masterName
 * Master name that gets bundled.
 *
 * @param {string} sourceFolder
 * Source folder with modules.
 *
 * @param {string} namespace
 * Shared namespace.
 *
 * @param {string} [externalsProduct]
 * Externals product to resolve to.
 *
 * @param {string} [externalsType]
 * Externals type to consider.
 *
 * @return {unknown}
 * Config for external reference, or `undefined` to include reference in bundle.
 */
export async function resolveExternals(
    info,
    masterName,
    sourceFolder,
    namespace,
    externalsProduct = 'highcharts',
    externalsType = 'umd'
) {
    const path = Path
        .relative(sourceFolder, Path.join(info.context, info.request))
        .replace(/(?:\.src)?\.js$/u, '')
        .replaceAll(Path.sep, Path.posix.sep);
    const namespaceName = Path.basename(path);

    // Quick exit
    if (
        masterName === externalsProduct ||
        masterName.includes('standalone')
    ) {
        return void 0;
    }

    for (const external of externals) {
        if (external.files.includes(path)) {

            if (external.included.includes(masterName)) {
                return void 0;
            }

            let externalModule = (external.included[0] || externalsProduct);
            let namespacePath = [
                ...external.namespacePath
                    .replace(/\{name\}/gsu, namespaceName)
                    .split('.')
                    .slice(1)
            ];

            switch (externalsType) {
                case 'module-import':
                    externalModule = Path.posix.relative(
                        Path.posix.dirname(`/${masterName}.src.js`),
                        `/${externalModule}.src.js`
                    );
                    externalModule = (
                        externalModule.startsWith('../') ?
                            externalModule :
                            `./${externalModule}`
                    );
                    return [
                        `${externalsType} ${externalModule}`,
                        'default',
                        ...namespacePath
                    ];
                case 'umd':
                    return createUMDConfig(namespace, ...namespacePath);
                default:
                    return {
                        [externalsType]: [namespace, ...namespacePath]
                    };
            }
        }
    }

    return void 0;
}


/* *
 *
 *  Default Export
 *
 * */


export default {
    resolveExternals
};


/* *
 *
 *  Doclet Types
 *
 * */


/**
 * @typedef ExternalsDefinition
 * @property {Array<string>} files
 * @property {Array<string>} included
 * @property {string} namespacePath
 */


/**
 * @typedef ExternalsJSON
 * @type {Array<ExternalsDefinition>}
 */


/**
 * @typedef ExternalsPluginOptions
 * @property {string} [definitionsPath]
 * @property {ExternalsJSON} [definitions]
 */
