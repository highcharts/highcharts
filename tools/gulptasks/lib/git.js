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

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    getStatus
};
