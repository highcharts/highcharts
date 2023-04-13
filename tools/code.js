/* *
 *
 *  Post processing function for the code folder.
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 * */

/* eslint-disable no-use-before-define, require-unicode-regexp */

/* *
 *
 *  Constants
 *
 * */

const extendsPattern = new RegExp([
    '(var __extends =.*?)',
    'Object\\.prototype\\.hasOwnProperty\\.call\\(b,\\s*p\\)',
    '(.*?)',
    'if \\(typeof b !== "function" && b !== null\\)\\s*throw new TypeError.*?"\\);\\s*',
    '(?=extendStatics\\()'
].join(''), 'gsu');

const fileExtensionPattern = /[^\\\/\.]\.([^\\\/]*)$/u;

const templateConcatsPattern = new RegExp([
    '("")',
    '((?:\\.concat\\([^"]+?, "[^"]*?"\\))+)'
].join(''), 'gsu');

const variablePattern = new RegExp([
    '(^|\\r\\n|\\r|\\n)',
    '([ \\t]+)',
    '(var[ \\t]+)',
    '([\\s\\S]+?)',
    '(?=;(?:\\r\\n|\\r|\\n|$))' // match stops before this pattern
].join(''), 'gmu');

/* *
 *
 *  Functions
 *
 * */

/**
 * Extracts the whole extension of the last path entry.
 *
 * @param {string} path
 * Path to extract from.
 *
 * @return {string|undefined}
 * Extracted extension.
 */
function getFileExtension(path) {
    const match = fileExtensionPattern.match(path);

    if (!match) {
        return void 0;
    }

    return (match[1] || '').toLowerCase();
}

/**
 * Removes edge cases of class validation by TypeScript 4.
 *
 * @param {string} content
 * Code content to process.
 *
 * @return {string}
 * Process code content.
 */
function processExtends(content) {
    return content.replace(extendsPattern, '$1b.hasOwnProperty(p)$2');
}

/**
 * Process files to improve quality.
 *
 * @param {string} filePath
 * File path of transpiled content to process.
 *
 * @param {string|Buffer} content
 * Transpiled code content to process.
 *
 * @return {string}
 * Processed code content.
 */
function processFile(filePath, content) {
    switch (getFileExtension(filePath)) {
        case '.src.js':
            return processSrcJSFile(content);
        default:
            return content;
    }
}

/**
 * Process code source files to improve quality.
 *
 * @param {string|Buffer} content
 * Transpiled code content to process.
 *
 * @return {string}
 * Processed code content.
 */
function processSrcJSFile(content) {
    let code = content.toString();

    code = processExtends(code);
    code = processTemplateLiterals(code);
    code = processVariables(code);

    return code;
}

/**
 * Simplifies template literals transpilation to plus concatination.
 *
 * @param {string} content
 * Code content to process.
 *
 * @return {string}
 * Process code content.
 */
function processTemplateLiterals(content) {
    return content.replace(templateConcatsPattern, function (
        _match,
        prefix,
        concats
    ) {
        return [
            prefix,
            concats
                .replace(/\)$/u, '')
                .replace(/["\)]?\.concat\(([\w\.\[\]]+?), ("[^"]*?")/gu, ' + $1 + $2')
                .replace(/["\)]?\.concat\(([^"]+?), ("[^"]*?")/gu, ' + ($1) + $2')
        ].join('');
    });
}

/**
 * Split multiple variables on the same line into several lines.
 *
 * @param {string} content
 * Code content to process.
 *
 * @return {string}
 * Process code content.
 */
function processVariables(content) {
    return content.replace(variablePattern, function (
        _match,
        prefix,
        indent,
        statement,
        variables
    ) {
        return (
            prefix + indent + statement +
            variables.split(/\r\n|\r|\n/gu).map(function (line) {

                if (
                    variables.match(/\/[^\/\n\r]+\//g) ||
                    variables.match(/\/\*\* @class \*\//g) ||
                    variables.match(/(['"])[^\1\n]*,[^\1\n]*\1/g)
                ) {
                    // skip lines with complex strings
                    return line;
                }

                const commentPosition = line.indexOf('//');

                let comment = '';

                if (commentPosition !== -1) {
                    comment = line.substr(commentPosition);
                    line = line.substr(0, commentPosition);
                }

                return (
                    line.replace(
                        /,[ \t]*?([A-z])/gu,
                        ',\n    ' + indent + '$1'
                    ) +
                    comment
                );

            }).join('\n    ')
        );
    });
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    processFile,
    processSrcJSFile
};
