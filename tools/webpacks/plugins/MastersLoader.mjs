/* *
 *
 *  Patchs missing imports as listed with require tags in master header.
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


import * as PPath from 'node:path/posix';

import FSLib from '../../libs/fs.js';
import { debugLog } from '../utilities.mjs';


/* *
 *
 *  Functions
 *
 * */


/**
 * Adds required master imports to the list of imports.
 *
 * @param {string} content
 * Master content to add to.
 *
 * @param {Array<string>} masterImports
 * Master imports to add.
 *
 * @return {string}
 * Decorated master content.
 */
function decorateImports(content, masterImports) {
    try {
        const importsMatches = content.matchAll(
            /(?:\n|\r\n)import.*?from.*?(['"])(.*?)\1.*?(?:\n|\r\n)/gsu
        );
        const useScriptMatch = content.match(/[\n\r](['"])use script\1/u);

        if (importsMatches) {
            const matches = Array.from(importsMatches);
            const insertFirstIndex = matches[0].index;
            const insertLastIndex = (
                matches[matches.length - 1].index +
                matches[matches.length - 1][0].length
            );
            const newFirstImports = [];
            const newLastImports = [];

            for (const path of masterImports) {
                if (matches.some(m => m[2] === path)) {
                    newLastImports.push(`/*! ${path} */`);
                } else if (path.endsWith('highcharts.src.js')){
                    newFirstImports.push(`import '${path}';`);
                } else {
                    newLastImports.push(`import '${path}';`);
                }
            }

            // Reverted insert order for stable index

            if (newLastImports.length) {
                content = insert(
                    newLastImports.join('\n') + '\n',
                    insertLastIndex,
                    content
                );
            }

            if (newFirstImports.length) {
                content = insert(
                    newFirstImports.join('\n') + '\n',
                    insertFirstIndex,
                    content
                );
            }

        } else if (useScriptMatch) {
            const insertIndex = useScriptMatch.index + useScriptMatch[0].length;
            const newImports = '\n' + masterImports
                .map(p => `import '${p}';`)
                .join('\n');

            content = insert(newImports, insertIndex, content);

        }
    } catch (error) {
        debugLog(error);
        content = `/* ERROR: ${error} */\n${content}`;
    }

    return content;
}


/**
 * Extracts require tags from master content.
 *
 * @param {string} content
 * Master content to extract from.
 *
 * @param {string} contentFolder
 * Master folder as relative context.
 *
 * @param {string} [requirePrefix]
 * Require prefix in require tags to ignore.
 *
 * @return {Array<string>|undefined}
 * Extracted requirements.
 */
function extractMasterImports(content, contentFolder, requirePrefix='') {
    const masterDoclet = content.match(/^\/\*(.*?)\*\//su)?.[1] || '';
    const requireMatches =
        masterDoclet.matchAll(/@requires?[ \t]+([\/\w\.-]+)/gsu);

    if (!requireMatches) {
        return;
    }

    const masterImports = [];
    let masterImport;

    for (const requireMatch of requireMatches) {
        masterImport = requireMatch[1];

        if (masterImport.startsWith(requirePrefix)) {
            masterImport = masterImport.substring(requirePrefix.length);
        }

        while (masterImport.startsWith('/')) {
            masterImport = masterImport.substring(1);
        }

        if (masterImport) {
            masterImport = PPath.join(contentFolder, masterImport) + '.src.js';

            if (
                !masterImport.startsWith('./') &&
                !masterImport.startsWith('../')
            ) {
                masterImport = `./${masterImport}`;
            }

            masterImports.push(masterImport);
        }

    }

    return masterImports;
}


/**
 * Inserts a string of new content at the given position of the content.
 *
 * @param {string} newContent
 * String of new content to insert.
 *
 * @param {number} pos
 * Position in content to insert into.
 *
 * @param {string} content
 * Content itself to insert into.
 *
 * @return {string}
 * Content with insert new string.
 */
function insert(newContent, pos, content) {
    return content.substring(0, pos) + newContent + content.substring(pos);
}


/**
 * Loader API for Webpack. Match pattern is defined outside in the general
 * loader configuration.
 *
 * @param {string} content
 * Content of matching file.
 *
 * @param {Webpack.SourceMap} map
 * Source map of matching file.
 *
 * @param {{webpackAST:*}} meta
 * Meta of matching file.
 */
function mastersLoader(content, map, meta) {
    try {
        const context = this;
        const callback = context.async();
        const options = context.getOptions();

        // The es-modules folder with all masters.
        const mastersFolder = FSLib.path(
            [process.cwd(), (options.mastersFolder || '/masters/')],
            true
        );

        // The content path relative to the mastersFolder.
        const contentFolder = PPath.relative(
            PPath.dirname(FSLib.path(context.resourcePath, true)),
            mastersFolder
        );

        // The product path as found on code.highcharts.com.
        const requirePrefix = options.requirePrefix

        const masterImports =
            extractMasterImports(content, contentFolder, requirePrefix);

        if (masterImports?.length) {
            content = decorateImports(content, masterImports);
        }

        callback(null, content, map, meta);
    } catch (error) {
        callback(error);
    }
}


/* *
 *
 *  Default Export
 *
 * */


export default mastersLoader;
