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


import PPath from 'node:path/posix';
import FSLib from '../libs/fs.js';


/* *
 *
 *  Constants
 *
 * */


/** @type {ExternalsJSON} */
const externals = [];


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
 * Decorates an import path to make sure it follows specifications.
 *
 * @param {string} path
 * Import path to decorate.
 *
 * @param {boolean} [asCJS]
 * Flag to indicate that the import path is for a CommonJS module.
 *
 * @return {string}
 * Decorated import path according to specifications.
 */
function decorateImportPath(
    path,
    asCJS
) {

    if (asCJS) {
        const extMatch = path.match(/\.[jt]sx?$/u);
        if (extMatch) {
            path = path.substring(0, path.length - extMatch[0].length);
        }
    } else {
        if (!path.match(/^[.]{1,2}\//u)) {
            path = `./${path}`;
        }
        if (!path.match(/\.[jt]sx?$/u)) {
            path += '.js';
        }
    }

    return path;
}


/**
 * Loads a configuration file with an array of external descriptions. This gets
 * consumed internally by `resolveExternals`.
 *
 * @see {@link ExternalsJSON}
 *
 * @param {string} filePath
 * File path to the configuration JSON.
 */
export function loadExternalsJSON(filePath) {
    const entries = FSLib.getFile(filePath, true);

    externals.length = 0;

    if (entries instanceof Array) {
        for (const entry of entries) {
            externals.push(entry);
        }
    }

}

/**
 * Appends additional externals to the current list.
 *
 * @param {Array<ExternalsDefinition>} [entries]
 * Additional externals to register.
 */
export function appendExternals(entries) {
    if (!entries) {
        return;
    }

    for (const entry of entries) {
        externals.push(entry);
    }
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
    let path = FSLib.path([info.context, info.request], true);

    mastersFolder = FSLib.path([process.cwd(), mastersFolder], true);

    if (!path.startsWith(mastersFolder)) {
        return void 0;
    }

    const nameInfo = path.match(/([^\/.]+)(\.[^\/]+)$/su);

    if (!nameInfo) {
        return void 0;
    }

    path = PPath.relative(mastersFolder, path);

    if (path === masterName + nameInfo[2]) {
        return void 0;
    }

    const namespaceName = PPath.basename(nameInfo[1]);

    switch (externalsType) {
        case 'module-import':
            const externalModule = decorateImportPath(
                PPath.relative(PPath.dirname(masterName), path)
            );
            return `${externalsType} ${externalModule}`;
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

    // Quick exit
    if (
        masterName === externalsProduct ||
        masterName.includes('standalone')
    ) {
        return void 0;
    }

    const myExternals = externals.slice();
    const path = PPath
        .relative(
            FSLib.path([process.cwd(), sourceFolder], true),
            FSLib.path([info.context, info.request], true)
        )
        .replace(/\.[^\/]+$/u, '')
    const namespaceName = PPath.basename(path);

    if (
        path.startsWith('masters/') &&
        !path.endsWith(masterName)
    ) {
        myExternals.push({
            files: [path],
            included: [
                masterName,
                path.substring(8)
            ],
            namespacePath: ''
        });
    }

    for (const external of myExternals) {
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
                    externalModule = PPath.relative(
                        PPath.dirname(`/${masterName}.src.js`),
                        `/${externalModule}.src.js`
                    );
                    externalModule = decorateImportPath(externalModule);
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
    loadExternalsJSON,
    makeExternals,
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
