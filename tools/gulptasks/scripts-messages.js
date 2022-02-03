/* eslint-disable no-use-before-define */
/*
 * Copyright (C) Highsoft AS
 */

const EOL = require('os').EOL;
const fs = require('fs');
const gulp = require('gulp');
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
const parseMarkdownCRLF = /\r\n|\r/;
const parseMarkdownBlockCode = /(?:^|\n)```(\w*)([\s\S]+?)[\n]+```/;
const parseMarkdownCode = /`([^`\s](?:[^`]|\s)*?)`/;
const parseMarkdownHeadline = /(?:^|\n)(#{1,5})([^\n]*)\1?/;
const parseMarkdownFormat = /(?:^| )(\*{1,3})(\w(?:[^\*]| )*?)\1/;
const parseMarkdownLink = /\[([^\]]+?)\]\(((?:[^\)]|\s)+?)\)/;
const parseMarkdownList =
    /(?:^|\n)[\t ]*[\-\+\*][\t ]+([\s\S]*?)(?=(?:\n)+|$)/;
const parseMarkdownParagraphs = / {2,}(?:\n)| ?(?:\n){2,}/;
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
 * Escape the HTML
 *
 * @param {string} str
 * String to escape.
 *
 * @return {string}
 * Escaped string.
 */
function escapeHTML(str) {
    Object
        .keys(htmlEscapeTable)
        .filter(key => str.indexOf(key) > -1)
        .forEach(key => (str = str.replace(
            new RegExp(htmlEscapeTable[key].regExp, 'g'),
            htmlEscapeTable[key].replacement
        )));
    return str;
}

/**
 * Read a readme.md file and parse it.
 *
 * @param {string} directoryPath
 * Directory of error.
 *
 * @return {Record<string, string>}
 * Parsed paragraphs of error text.
 */
function parseErrorDirectory(directoryPath) {
    const files = [path.relative(
            rootPath, path.join(directoryPath, 'readme.md')
        )],
        readme = parseMarkdown(
            fs
                .readFileSync(
                    path.join(directoryPath, 'readme.md'),
                    { encoding: '' }
                )
                .toString(),
            true
        );

    try {
        const enduser = parseMarkdown(
            fs
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
    } catch (err) {
        return readme;
    }

    return readme;
}

/**
 * Read the directory with markdown errors.
 *
 * @param {string} directoryPath
 * Directory of markdown files.
 *
 * @return {Promise}
 * Promise to keep.
 */
function parseErrorsDirectory(directoryPath) {

    return new Promise((resolve, reject) => fs.readdir(
        directoryPath,
        (err, directories) => {

            if (err) {
                reject(err);
                return;
            }

            const parsedErrors = {};

            directories
                .map(directory => path.join(directoryPath, directory))
                .filter(directory => fs.statSync(directory).isDirectory())
                .forEach(directory => {
                    const errorCode = parseInt(path.basename(directory), 10);
                    if (isNaN(errorCode)) {
                        return;
                    }
                    parsedErrors[errorCode] = parseErrorDirectory(directory);
                });

            resolve(parsedErrors);
        }
    ));
}

/**
 * Parse the markdown.
 *
 * @param {string} text
 * Markdown text to parse.
 *
 * @param {boolean} [extractTitle=false]
 * Whether to extract title or not.
 *
 * @return {Record<string, string>}
 * Parsed paragraphs of text.
 */
function parseMarkdown(text, extractTitle) {

    const codeBlocks = [];

    let title = '';

    if (extractTitle) {
        const titleMatch = text.match(new RegExp(parseMarkdownHeadline));
        if (titleMatch) {
            title = (titleMatch[2] || '').trim();
        }
    }

    text = ('<p>' + text
        .trim()
        .replace(new RegExp(parseMarkdownCRLF, 'g'), '\n')
        .replace(
            new RegExp(parseMarkdownBlockCode, 'g'),
            (match, language, content) => {
                codeBlocks.push(content);
                return blockCodePlaceholder;
            }
        )
        .replace(new RegExp(parseMarkdownCode, 'g'), '<code>$1</code>')
        .replace(new RegExp(parseMarkdownLink, 'g'), (match, urlText, url) => (
            '<a href="' +
            url.replace(new RegExp(parseSpaces, 'g'), '') +
            '">' +
            urlText.replace(new RegExp(parseSpaces, 'g'), ' ') +
            '</a>'
        ))
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
                    default:
                        return match;
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
            () => (
                '</p><pre>' +
                escapeHTML((codeBlocks.shift() || '').trim()) +
                '</pre><p>'
            )
        ) + '</p>')
        .replace(new RegExp(parseParagraphSpaces, 'g'), '');

    return { title, text };
}

/**
 * Write parsed errors to a file.
 *
 * @param {*} parsedErrors
 * Errors object.
 *
 * @param {string} jsonPath
 * JSON path to write.
 *
 * @param {string} modulePath
 * Module path to write.
 *
 * @return {Promise}
 * Promise to keep.
 */
function writeErrorsJson(parsedErrors, jsonPath, modulePath) {
    return Promise.all([
        new Promise((resolve, reject) => fs.writeFile(
            jsonPath,
            JSON.stringify(
                parsedErrors,
                void 0,
                '\t'
            ).replace(/\n/g, EOL),
            err => (err ? reject(err) : resolve())
        )),
        new Promise((resolve, reject) => fs.writeFile(
            modulePath,
            [
                '/* eslint-disable */',
                '/* *',
                ' * Error information for the debugger module',
                ' * (c) 2010-2021 Torstein Honsi',
                ' * License: www.highcharts.com/license',
                ' */',
                '',
                '// DO NOT EDIT!',
                '// Automatically generated by ./tools/error-messages.js',
                '// Sources can be found in ./errors/*/*.md',
                '',
                '\'use strict\';',
                '',
                'const errorMessages: Record<string, Record<string, string>> = ' +
                JSON.stringify(
                    parsedErrors,
                    void 0,
                    '    '
                ).replace(/\n/g, EOL) +
                ';',
                '',
                'export default errorMessages;'
            ].join(EOL),
            err => (err ? reject(err) : resolve())
        ))
    ]);
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * Main gulp task.
 *
 * @return {Promise}
 * Promise to keep
 */
function scriptsMessages() {
    const logLib = require('./lib/log.js');

    return parseErrorsDirectory(path.join(rootPath, 'errors'))
        .then(parsedErrors => writeErrorsJson(
            parsedErrors,
            path.join(rootPath, 'errors', 'errors.json'),
            path.join(rootPath, 'ts', 'Extensions', 'Debugger', 'ErrorMessages.ts')
        ))
        .catch(error => {
            logLib.failure(error);
            process.exit(1); // eslint-disable-line
        });
}

gulp.task('scripts-messages', scriptsMessages);
