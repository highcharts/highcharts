/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

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

    const ChildProcess = require('child_process');

    return new Promise((resolve, reject) => {

        ChildProcess.exec(
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
 * @return {Promise<String>}
 *         Promise to keep with results
 */
function getLatestCommitShaSync(useShortVersion = false) {
    const ChildProcess = require('child_process');
    return ChildProcess.execSync(`git log --pretty=format:'%${useShortVersion ? 'h' : 'H'}' -n 1`).toString();
}

/**
 * Returns the files changed compared with master branch
 *
 * @return {Promise<String>}
 *         Promise to keep with results
 */
function getFilesChanged() {
    const ChildProcess = require('child_process');
    return ChildProcess.execSync('git whatchanged --name-status --pretty="" origin..HEAD').toString() || '';
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    getStatus,
    getLatestCommitShaSync,
    getFilesChanged
};
