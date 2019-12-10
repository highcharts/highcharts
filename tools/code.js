/* *
 *
 *  Post processing function for the code folder.
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 * */

/* *
 *
 *  Functions
 *
 * */

/**
 * Process code files after TypeScript transpilation.
 *
 * @param {string|Buffer} content
 * Transpiled code content to process.
 *
 * @return {string}
 * Processed code content.
 */
function process(content) {
    return content.toString();
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
    return content.replace(
        /(^|\n)([ \t]+)(var[ \t]+)([\s\S]+?)(;(?:\n|$))/gm,
        function (match, prefix, indent, statement, variables, suffix) {
            return (
                prefix + indent + statement +
                variables.split(/\n/g).map(function (line) {

                    if (variables.match(/(['"])[^\1\n]*,[^\1\n]*\1/g)) {
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
                            /,[ \t]*?([A-z])/g,
                            ',\n    ' + indent + '$1'
                        ) +
                        comment
                    );

                }).join('\n    ') +
                suffix
            );
        }
    );
}

/**
 * Process code source files to improve readability.
 *
 * @param {string|Buffer} content
 * Transpiled code content to process.
 *
 * @return {string}
 * Processed code content.
 */
function processSources(content) {
    return processVariables(content.toString());
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    process,
    processSources
};
