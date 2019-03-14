/*
 * Copyright (C) Highsoft AS
 */

/**
 * Removes script comments (`//...`, `/*...`) from a source string.
 * @param {string} str
 *        Source string
 *
 * @return {string}
 *         Source string without comments
 */
function removeComments(str) {
    return str.replace(/\/\*[\s\S]*?\*\/|(^|[^:])\/\/.*$/gm, '$1');
}

/**
 * Replaces all pattern in a string.
 *
 * @param {string} str
 *        String to modify.
 *
 * @param {string} pattern
 *        Pattern to search.
 *
 * @param {string} replacement
 *        Replacement for pattern.
 *
 * @return {string}
 *         Modified string.
 */
function replaceAll(str, pattern, replacement) {
    return str.split(pattern).join(replacement);
}

/**
 * Replaces last pattern in a string.
 *
 * @param {string} str
 *        String to modify.
 *
 * @param {string} pattern
 *        Pattern to search.
 *
 * @param {string} replacement
 *        Replacement for pattern.
 *
 * @return {string}
 *         Modified string.
 */
function replaceLast(str, pattern, replacement) {

    if (!str || !pattern || !replacement) {
        return str;
    }

    const lastIndex = str.lastIndexOf(pattern);

    return str.substr(0, lastIndex) + str.substr(lastIndex).replace(pattern, replacement);
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    removeComments,
    replaceAll,
    replaceLast
};
