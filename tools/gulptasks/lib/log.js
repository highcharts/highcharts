/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-console:0 */

const Colors = require('colors');
const Time = require('./time');

const startTimeDictionary = {};

/**
 * Formats a text in gulp style for console output.
 *
 * @param {string} text
 *        Text to format
 *
 * @param {string} [color]
 *        Optional color for text.
 *
 * @return {string}
 *         Formatted text
 */
function format(text, color) {
    return (
        '[' + Colors.gray((new Date()).toTimeString().substr(0, 8)) + '] ' +
         (color ? Colors[color || ''](text) : text)
    );
}

/**
 * Writes a starting message in gulp style into the console.
 *
 * @param {string} text
 *        What has finished
 *
 * @param {number} [startTime]
 *        Optional start time
 *
 * @return {void}
 */
function finished(text, startTime) {

    const endTime = (new Date()).getTime();

    delete startTimeDictionary[text];

    let after = '';

    if (startTime) {
        after = ' after ' + Colors.magenta(Time.scale(endTime - startTime));
    }

    console.info(format('Finished \'' + Colors.cyan(text) + '\'' + after));

}

/**
 * Writes a message in gulp style into the console.
 *
 * @param {Array<string>} text
 *        Message text to write
 *
 * @return {void}
 */
function message(...text) {
    console.info(format(text.join(' ')));
}

/**
 * Writes a starting message in gulp style into the console.
 *
 * @param {string} text
 *        What is starting
 *
 * @return {number}
 *         Start time
 */
function starting(text) {

    const startTime = (new Date()).getTime();

    console.info(format('Starting \'' + Colors.cyan(text) + '\'...'));

    return startTime;
}

/**
 * Writes a green success message in gulp style into the console.
 *
 * @param {string} text
 *        Message text to write
 *
 * @return {void}
 */
function success(text) {
    console.info(format(text, 'green'));
}

module.exports = {
    finished,
    format,
    message,
    starting,
    success
};
