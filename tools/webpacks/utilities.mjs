/* *
 *
 *  Imports
 *
 * */


import * as Path from 'node:path';


/* *
 *
 *  Constants
 *
 * */


const MASTER_NAME_PATTERN = /(?:\.src)?\.js$/u;


/* *
 *
 *  Functions
 *
 * */


export function getMasterName(masterPath) {
    return masterPath
        .replace(MASTER_NAME_PATTERN, '')
        .replaceAll(Path.sep, Path.posix.sep);
}


/* *
 *
 *  Default Export
 *
 * */


export default {
    getMasterName
};
