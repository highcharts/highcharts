/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

const { execSync, exec } = require('child_process');

/* *
 *
 *  Constants
 *
 * */

const PORCELAN_REGEXP = /([ACDMRU\?\! ])([ACDMRU\?\! ]) ([\.\/\w]+)/;

/* *
 *
 *  Functions
 *
 * */

/**
 * Returns the list of modified files, that are either staged or unstaged.
 *
 * @return {Promise<Array<[string,string,string]>>}
 *         Promise to keep with results
 */
function getStatus() {
    return new Promise((resolve, reject) => {

        exec(
            'git status --porcelain',
            (error, stdout) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve((
                    stdout
                        .split('\n')
                        .map(line => PORCELAN_REGEXP.exec(line))
                        .filter(match => !!match)
                        .map(match => (
                            (new Array(...match))
                                .slice(1)
                                .map(column => column.trim())
                        ))
                ));
            }
        );
    });
}

/**
 * Returns the lastest commit sha
 *
 * @param {Boolean} useShortVersion if you want the short version of the latest git sha.
 * @return {String}
 * Commit SHA
 */
function getLatestCommitShaSync(useShortVersion = false) {
    return execSync(`git log --pretty=format:'%${useShortVersion ? 'h' : 'H'}' -n 1`).toString();
}

/**
 * Returns the lastest commit SHA for a given path
 *
 * @param {Boolean} path
 * The path to check
 *
 * @return {String}
 * Commit SHA
 */
function getLatestCommitShaByPath(path) {
    return execSync(`git log -1 --format=format:%H --full-diff ${path}`).toString();
}

/**
 * Returns the files changed compared with master branch
 *
 * @return {Promise<String>}
 *         Promise to keep with results
 */
function getFilesChanged() {
    return execSync('git whatchanged --name-status --pretty="" origin..HEAD').toString() || '';
}


/**
 * Checks if the latest commit contains a change in the given path.
 * Note: pretty slow, don't run on a huge array
 *
 * @param {string} path
 * The path to check, i.e. `samples/highcharts/demo`
 *
 * @return {boolean} `true` or `false`
 */
function shouldUpdate(path) {
    try {
        return !!(getLatestCommitShaSync().trim() === getLatestCommitShaByPath(path).trim());
    } catch (error) {
        return false;
    }
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    shouldUpdate,
    getStatus,
    getLatestCommitShaSync,
    getFilesChanged
};
