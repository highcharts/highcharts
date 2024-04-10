/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-console: 0, no-use-before-define: 0 */

const ChildProcess = require('child_process');
const Colors = require('colors');
const Time = require('./time');

const startTimeDictionary = {};

/**
 * Writes a red failure message in gulp style into the console.
 *
 * @param {Array<string>} text
 *        Message text to write
 *
 * @return {void}
 */
function failure(...text) {
    console.error(format(text.join(' '), 'red'));
}

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
 * Calls a speech synthesizer to say a given text. There is no guarantee that
 * the computer speaks or the developer hears the spoken text.
 *
 * @param {string} text
 *        Text to speak;
 *
 * @return {void}
 */
function say(text) {

    try {
        switch (process.platform) {
            default:
                break;
            case 'darwin':
                ChildProcess.execSync('say -v Daniel "[[volm 0.5]]' + text.replace(/"/g, '') + '"');
                break;
            case 'win32':
                ChildProcess.execSync(
                    'tools\\speak.vbs "' + text.replace(/"/g, '') + '"'
                );
                break;
        }
    } catch (catchedError) {
        failure(catchedError);
    }
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
function success(...text) {
    console.info(format(text.join(' '), 'green'));
}

/**
 * Writes a yellow warning message in gulp style into the console.
 *
 * @param {Array<string>} text
 *        Message text to write
 *
 * @return {void}
 */
function warn(...text) {
    console.info(format(text.join(' '), 'yellow'));
}

module.exports = {
    failure,
    finished,
    format,
    message,
    say,
    starting,
    success,
    warn
};
