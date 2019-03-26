/*
 * Copyright (C) Highsoft AS
 */

const ChildProcess = require('child_process');
const LibLog = require('./log');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

/**
 * Own package directory
 */
const CPD = Path.join(__dirname, '..', '..', '..');

/**
 * Current working directory
 */
const CWD = process.cwd();

/* *
 *
 *  Functions
 *
 * */

/**
 * Executes a single terminal command and returns when finished.
 * Outputs stdout to the console.
 *
 * @param {string} command
 *                 Command to execute in terminal
 *
 * @return {Promise<string>}
 *         Promise to keep with all terminal output
 */
function exec(command) {

    return new Promise((resolve, reject) => {

        const cli = ChildProcess.exec(command, (error, stdout) => {
            if (error) {
                LibLog.failure(error);
                reject(error);
            } else {
                LibLog.success('Command finished: ' + command);
                resolve(stdout);
            }
        });

        cli.stdout.on('data', data => process.stdout.write(data));
    });
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    CPD,
    CWD,
    exec
};
