/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

const LogLib = require('./log');
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

/**
 * Configuration file containing running information
 */
const CONFIG_FILE = Path.join(
    CPD, 'node_modules', '_gulptasks_lib_process.json'
);

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
 *        Command to execute in terminal
 *
 * @param {boolean} silent
 *        Silents the command output to stdout
 *
 * @return {Promise<string>}
 *         Promise to keep with all terminal output
 */
function exec(command, silent) {

    const ChildProcess = require('child_process');

    return new Promise((resolve, reject) => {

        const cli = ChildProcess.exec(command, (error, stdout) => {
            if (error) {
                LogLib.failure(error);
                reject(error);
            } else {
                LogLib.success(
                    (silent ? 'Command finished (silent):' : 'Command finished:'),
                    command
                );
                resolve(stdout);
            }
        });

        if (!silent) {
            cli.stdout.on('data', data => process.stdout.write(data));
        }
    });
}

/**
 * Sharing run state between gulp processes.
 *
 * @param {string} name
 *        Individual name
 *
 * @param {boolean} [runningFlag]
 *        If not set get current flag
 *
 * @param {boolean} [keepOnExit]
 *        Not clear running flag on process exit
 *
 * @return {boolean}
 *         Running flag
 */
function isRunning(name, runningFlag, keepOnExit) {

    const config = readConfig();
    const key = name.replace(/[^-\w]+/g, '_');

    if (typeof runningFlag === 'undefined') {
        return (config.isRunning[key] === true);
    }

    if (!runningFlag) {
        if (Object.keys(config.isRunning).includes(key)) {
            delete config.isRunning[key];
            writeConfig(config);
        }
    } else {
        config.isRunning[key] = true;
        writeConfig(config);
        if (!keepOnExit) {
            [
                'exit', 'uncaughtException',
                'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'
            ].forEach(
                evt => process.on(evt, code => {
                    isRunning(key, false, true);
                    process.exit(code); // eslint-disable-line no-process-exit
                })
            );
        }
        writeConfig(config);
    }

    return (config.isRunning[key] === true);
}

/**
 * Reads library-specific configuration file
 *
 * @return {object}
 *         Configuration
 */
function readConfig() {

    const FS = require('fs');

    let config = {
        isProcessing: {},
        isRunning: {}
    };

    if (FS.existsSync(CONFIG_FILE)) {
        try {
            config = JSON.parse(FS.readFileSync(CONFIG_FILE).toString());
        } catch (catchedError) {
            LogLib.warn(catchedError);
        }
    }

    return config;
}

/**
 * Writes library-specific configuration file.
 *
 * @param {object} config
 *        Configuration
 *
 * @return {void}
 */
function writeConfig(config) {

    const FS = require('fs');

    FS.writeFileSync(CONFIG_FILE, JSON.stringify(config));
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    CPD,
    CWD,
    exec,
    isRunning
};
