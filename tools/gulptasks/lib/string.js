/*
 * Copyright (C) Highsoft AS
 */

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
    replaceAll,
    replaceLast
};
