/* eslint-disable */
/* eslint-env node,es6 */
/**
 * (c) 2010-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 *
 * @module tools/errorsinfo.js
 * @author Sophie Bremer
 */

const fs = require('fs');
const path = require('path').posix;

/* *
 *
 *  Constants
 *
 * */

const blockCodePlaceholder = '<<<>>>';
const htmlEscapeTable = {
    '&': {
        regExp: /&/,
        replacement: '&amp;'
    },
    '"': {
        regExp: /"/,
        replacement: '&quot;'
    },
    '<': {
        regExp: /</,
        replacement: '&lt;'
    },
    '>': {
        regExp: />/,
        replacement: '&gt;'
    }
};
const parseMarkdownBlockCode = /(?:^|\r\n|\n|\r)```(\w*)([\s\S]+?)[\n\r]+```/;
const parseMarkdownCode = /`([^`\s](?:[^`]|\s)*?)`/;
const parseMarkdownHeadline = /(?:^|\r\n|\n|\r)(#{1,5})([^\n\r]*)\1?/;
const parseMarkdownFormat = /(?:^| )(\*{1,3})(\w(?:[^\*]| )*?)\1/;
const parseMarkdownLink = /\[([^\]]+?)\]\(((?:[^\)]|\s)+?)\)/;
const parseMarkdownList =
    /(?:^|\r\n|\n|\r)[\t ]*[\-\+\*][\t ]+([\s\S]*?)(?=(?:\r\n|\n|\r)+|$)/;
const parseMarkdownParagraphs = / {2,}(?:\r\n|\n|\r)| ?(?:\r\n|\n|\r){2,}/;
const parseBlockCodePlaceholder = /<<<>>>/;
const parseListSpaces = /<\/li><\/ul><p>\s*?<\/p><ul><li>/;
const parseParagraphSpaces = /<p><\/p>/;
const parseSpaces = /\s+/;
const rootPath = process.cwd();

/* *
 *
 *  Functions
 *
 * */

/**
 * @function escapeHTML
 * @param {string} str 
 */
function escapeHTML(str) {
    Object
        .keys(htmlEscapeTable)
        .filter(key => str.indexOf(key) > -1)
        .forEach(key => str = str.replace(
            new RegExp(htmlEscapeTable[key].regExp, 'g'),
            htmlEscapeTable[key].replacement)
        )
    return str;
}

/**
 * @function matchAll
 * @param {string} str 
 * @param {RegExp} regexp 
 */
function matchAll(str, regexp) {
    const matches = [];
    str.replace(regexp, function () {
        matches.push(([]).slice.call(arguments, 0, -2));
    });
    return matches;
}

/**
 * @function parseMarkdown
 * @param {string} text
 * @param {boolean} [extractTitle=false]
 */
function parseMarkdown (text, extractTitle) {

    const codeBlocks = [];

    let title = '';

    if (extractTitle) {
        let titleMatch = text.match(new RegExp(parseMarkdownHeadline));
        if (titleMatch) {
            title = (titleMatch[2] || '').trim();
        }
    }

    text = ('<p>' + text
        .trim()
        .replace(
            new RegExp(parseMarkdownBlockCode, 'g'),
            (match, language, content) => {
                codeBlocks.push(content);
                return blockCodePlaceholder;
            }
        )
        .replace(new RegExp(parseMarkdownCode, 'g'), '<code>$1</code>')
        .replace(new RegExp(parseMarkdownLink, 'g'), (match, text, url) => {
            return (
                '<a href="' +
                url.replace(new RegExp(parseSpaces, 'g'), '') +
                '">' +
                text.replace(new RegExp(parseSpaces, 'g'), ' ') +
                '</a>'
            );
        })
        .replace(
            new RegExp(parseMarkdownList, 'g'),
            '</p><ul><li>$1</li></ul><p>'
        )
        .replace(new RegExp(parseListSpaces, 'g'), '</li><li>')
        .replace(
            new RegExp(parseMarkdownFormat, 'g'),
            (match, pattern, content) => {
                switch (pattern) {
                    case '*':
                        return ('<i>' + content + '</i>');
                    case '**':
                        return ('<b>' + content + '</b>');
                    case '***':
                        return ('<b><i>' + content + '</i></b>');
                }
            }
        )
        .replace(
            new RegExp(parseMarkdownHeadline, 'g'),
            (match, pattern, content) => (
                '</p><h' + pattern.length + '>' +
                content.trim() +
                '</h' + pattern.length + '><p>'
            )
        )
        .replace(new RegExp(parseMarkdownParagraphs, 'g'), '</p><p>')
        .replace(new RegExp(parseSpaces, 'g'), ' ')
        .replace(
            new RegExp(parseBlockCodePlaceholder, 'g'),
            (match) => (
                '</p><pre>' +
                escapeHTML((codeBlocks.shift() || '').trim()) +
                '</pre><p>'
            )
        ) + '</p>')
        .replace(new RegExp(parseParagraphSpaces, 'g'), '');

    return {
        title: title,
        text: text
    };
}

/**
 * @function parseErrorDirectory
 * @param {number} errorCode 
 * @param {string} directoryPath 
 */
function parseErrorDirectory (directoryPath) {

    let files = [ path.relative(
            rootPath, path.join(directoryPath, 'readme.md')
        ) ],
        readme = parseMarkdown(fs
            .readFileSync(
                path.join(directoryPath, 'readme.md'),
                { encoding: '' }
            )
            .toString(),
            true
        );

    try {
        let enduser = parseMarkdown(fs
            .readFileSync(
                path.join(directoryPath, 'enduser.md'),
                { encoding: '' }
            )
            .toString()
        );
        files.push(path.relative(
            rootPath, path.join(directoryPath, 'enduser.md')
        ));
        readme.enduser = enduser.text;
    } catch (err) {}

    return readme;
}

/**
 * @function parseErrorsDirectory
 * @param {string} directoryPath 
 */
function parseErrorsDirectory (directoryPath) {

    return new Promise((resolve, reject) => fs.readdir(
        directoryPath,
        (err, directories) => {

            if (err) {
                reject(err);
                return;
            }

            let parsedErrors = {};

            directories
                .map(directory => path.join(directoryPath, directory))
                .filter(directory => fs.statSync(directory).isDirectory())
                .forEach(directory => {
                    let errorCode = parseInt(path.basename(directory));
                    if (errorCode === NaN) {
                        return;
                    }
                    parsedErrors[errorCode] = parseErrorDirectory(directory);
                });

            resolve(parsedErrors);
        }
    ));
}

/**
 * @function processingComplete
 * @param {*} parsedErrors
 * @param {string} jsonPath
 * @param {string} modulePath
 */
function writeErrorsJson (parsedErrors, jsonPath, modulePath) {

    if (1 == 0 && fs.existsSync(jsonPath)) {
        const oldErrorsJson = require(jsonPath);
        const same = Object
            .keys(oldErrorsJson)
            .every(error => (
                oldErrorsJson[error].title === parsedErrors[error].title &&
                oldErrorsJson[error].text === parsedErrors[error].text &&
                oldErrorsJson[error].enduser === parsedErrors[error].enduser
            ));
        const version = require(rootPath  + '/package.json').version;
    }

    return Promise.all([
        new Promise((resolve, reject) => fs.writeFile(jsonPath,
            JSON.stringify(parsedErrors, undefined, '\t'),
            err => (err ? reject(err) : resolve())
        )),
        new Promise((resolve, reject) => fs.writeFile(modulePath, [
                '/* eslint-disable */',
                '/* *',
                ' * Error information for the debugger module',
                ' * (c) 2010-2021 Torstein Honsi',
                ' * License: www.highcharts.com/license',
                ' */',
                ,
                '// DO NOT EDIT!',
                '// Automatically generated by ./tools/error-messages.js',
                '// Sources can be found in ./errors/*/*.md',
                ,
                '\'use strict\';',
                ,
                'const errorMessages: Record<string, Record<string, string>> = ' +
                JSON.stringify(parsedErrors, undefined, '    ') +
                ';',
                ,
                'export default errorMessages;'
        ].join('\n'),
            err => (err ? reject(err) : resolve())
        ))
    ]);
    
}

module.exports = function () {
    return parseErrorsDirectory(path.join(rootPath, 'errors'))
        .then(parsedErrors => writeErrorsJson(
            parsedErrors,
            path.join(rootPath, 'errors', 'errors.json'),
            path.join(rootPath, 'ts', 'Extensions', 'Debugger', 'ErrorMessages.ts')
        ))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
};
