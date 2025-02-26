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
 * Resolves external references of the binded master file to specific UMD paths.
 *
 * @param {*} info
 * Webpack reference information.
 *
 * @param {string} masterName
 * Master name that gets bundled.
 *
 * @param {string} sourceFolder
 * Source folder with masters.
 *
 * @param {string} namespace
 * Source folder with masters.
 *
 * @return
 * UMD config for external reference, or `undefined` to include reference in
 * bundle.
 */
export async function resolveExternals(info, masterName, sourceFolder, namespace) {
    const path = Path
        .relative(sourceFolder, Path.join(info.context, info.request))
        .replace(/(?:\.src)?\.js$/u, '')
        .replaceAll(Path.sep, Path.posix.sep);
    const namespaceName = Path.basename(path);

    // Quick exit on entry point
    if (masterName === namespaceName) {
        return void 0;
    }

    // Quick exit on standalone
    if (masterName.includes('standalone')) {
        return void 0;
    }

    for (const external of externals) {
        if (external.files.includes(path)) {
            return (
                external.included.includes(masterName) ?
                    void 0 :
                    createUMDConfig(
                        namespace,
                        ...external.namespacePath
                            .replace(/\{name\}/gsu, namespaceName)
                            .split('.')
                            .slice(1)
                    )
            );
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
