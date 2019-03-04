/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-console:0 */

const ChildProcess = require('child_process');
const Path = require('path');

const CPD = Path.join(__dirname, '..', '..', '..');
const CWD = process.cwd();

/**
 * Executes a single terminal command and returns when finished.
 * Outputs stdout to the console.
 *
 * @param {string} command
 *                 Command to execute in terminal
 *
 * @return {Promise}
 *         Returns all output to the terminal in form of a string.
 */
function commandLine(command) {
    return new Promise((resolve, reject) => {
        const cli = ChildProcess.exec(command, (error, stdout) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.info('Command finished: ' + command);
                resolve(stdout);
            }
        });
        cli.stdout.on('data', data => console.log(data.toString()));
    });
}

module.exports = {
    CPD,
    CWD,
    commandLine
};
