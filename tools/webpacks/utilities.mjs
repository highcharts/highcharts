/* *
 *
 *  Imports
 *
 * */


import * as FS from 'node:fs';
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


export function debugLog(...anything) {
    const content = anything
        .map(e => {
            if (typeof e !== 'object') {
                return e.toString();
            }
            if (e instanceof Error) {
                return `${e.name}: ${e.message}` + (e.stack ? `\n${e.stack}` : '');
            }
            return JSON.stringify(e);
        })
        .join(' ');

    FS.writeFileSync('webpack.log', content, { flag: 'a' }); // 'a' - append
}


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
    debugLog,
    getMasterName
};
