/* eslint-disable */
/* eslint-env node,es6 */
/**
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 *
 * @module plugins/highcharts.errors.js
 * @author Sophie Bremer
 */

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

/* *
 *
 *  Constants
 *
 * */

const rootPath = process.cwd();
const docletNamePrefix = 'Highcharts.Chart#event:error';
const parseMarkdownBlockCode = /(?:^|\n)```(\w*?)([\s\S]+?)\n```/;
const parseMarkdownCode = /(?:^|\s)`(\w(?:[^`]|\s)*?)`/;
const parseMarkdownFormat = /(?:^|\s)(\*{1,3})(\w(?:[^\*]|\s)*?)\1/;
const parseMarkdownLink = /\[([^\]]+?)\]\(((?:[^\)]|\s)+?)\)/;
const parseMarkdownList = /(?:^|\n)[\-\+\*] ([\s\S]*?)(?=\n\n|$)/;
const parseMarkdownParagraphs = /\s{2,}/;
const parseBlockCodePlaceholder = /<<<>>>/;
const parseListSpaces = /<\/li><\/ul><p>\s*?<\/p><ul><li>/;
const parseParagraphSpaces = /<p><\/p>/;
const parseSpaces = /\s+/;
const parseSections = /^\*\*(\w[^\*]*?\n?[^\*]*?)\*\*([\s\S]+)$/;

/* *
 *
 *  Variables
 *
 * */

let errorsDictionary = {};

/* *
 *
 *  Private Functions
 *
 * */

function matchAll(str, regexp) {
    const matches = [];
    str.replace(regexp, function () {
        matches.push(([]).slice.call(arguments, 0, -2));
    });
    return matches;
}

/* *
 *
 *  JSDoc Functions
 *
 *  Documentation: http://usejsdoc.org/about-plugins.html
 * 
 * */

/**
 * The parseBegin event is fired before JSDoc starts loading and parsing the
 * source files.
 *
 * @function parseBegin
 *
 * @param {Event} e
 *        JSDoc event.
 */
function parseBegin (e) {

    errorsDictionary.meta = {
        branch: childProcess
            .execSync('git rev-parse --abbrev-ref HEAD', {cwd: rootPath})
            .toString()
            .trim(),
        commit: childProcess
            .execSync('git rev-parse --short HEAD', {cwd: rootPath})
            .toString()
            .trim(),
        // date: (new Date()).toString(), <-- results in minimal changes of errors/errors.json
        files: [],
        version: require(rootPath  + '/package.json').version
    };
}

/**
 * The fileBegin event is fired when the parser is about to parse a file.
 *
 * @function fileBegin
 *
 * @param {Event} e
 *        JSDoc event.
 */
function fileBegin (e) {

    currentFilePath = path.relative(rootPath, e.filename);
    errorsDictionary.meta.files.push({
        path: currentFilePath,
        line: 0
    });
}

/**
 * The newDoclet event is fired when a new doclet has been created.
 *
 * @function newDoclet
 *
 * @param {Event} e
 *        JSDoc event.
 */
function newDoclet (e) {

    const doclet = e.doclet;
    const name = (doclet.longname || doclet.name || '');

    if (!name.startsWith(docletNamePrefix)) {
        return;
    }

    const errorCode = parseInt(name.substr(docletNamePrefix.length));

    if (!errorCode) {
        return;
    }

    const sections = matchAll(
        doclet.description, new RegExp(parseSections, 'g')
    );

    if (!sections[0] ||
        sections.length < 1
    ) {
        return;
    }

    const codeBlocks = [];
    const title = (sections[0][1] || 'Untitled Error');

    let body = (sections[0][2] || '')
        .trim()
        .replace(
            new RegExp(parseMarkdownBlockCode),
            (language, content) => {
                codeBlocks.push(content);
                return parseBlockCodePlaceholder.toString();
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
        .replace(new RegExp(parseMarkdownParagraphs, 'g'), '</p><p>')
        .replace(new RegExp(parseParagraphSpaces, 'g'), '')
        .replace(new RegExp(parseSpaces, 'g'), ' ')
        .replace(
            new RegExp(parseBlockCodePlaceholder, 'g'),
            (match) => (codeBlocks.shift() || '')
        );

    body = ('<p>' + body + '</p>');

    errorsDictionary[errorCode] = {
        title: title,
        text: body
    };
}

/**
 * The fileComplete event is fired when the parser has finished parsing a file.
 *
 * @function fileComplete
 *
 * @param {Event} e
 *        JSDoc event.
 */
function fileComplete (e) {

    currentFilePath = '';
}

/**
 * The processingComplete event is fired after JSDoc updates the parse results
 * to reflect inherited and borrowed symbols.
 *
 * @function processingComplete
 *
 * @param {Event} e
 *        JSDoc event.
 */
function processingComplete (e) {

    fs.writeFileSync(
        path.join(rootPath, 'errors/errors.json'),
        JSON.stringify(errorsDictionary, undefined, '\t')
    );
}

/**
 * JSDoc event handlers.
 *
 * @name handlers
 * @type {Dictionary<Function>}
 */
exports.handlers = {
    parseBegin: parseBegin,
    fileBegin: fileBegin,
    newDoclet: newDoclet,
    fileComplete: fileComplete,
    processingComplete: processingComplete
};
