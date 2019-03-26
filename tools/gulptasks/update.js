/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const CONFIGURATION_FILE = Path.join('node_modules', '_gulptasks_update.json');

/* *
 *
 *  Tasks
 *
 * */

/**
 * Updates node packages.
 *
 * @return {Promise}
 *         Promise to keep.
 */
function task() {

    const FS = require('fs');
    const LogLib = require('./lib/log');
    const ProcessLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        const now = (new Date()).getTime();

        let configuration = {
            checkFrequency: 'weekly',
            lastCheck: 0
        };

        if (FS.existsSync(CONFIGURATION_FILE)) {
            configuration = JSON.parse(
                FS.readFileSync(CONFIGURATION_FILE).toString()
            );
        }

        let minimumTime = now;

        switch (configuration.checkFrequency) {
            default:
            case 'weekly':
                minimumTime -= Date.UTC(1970, 0, 8);
                break;
            case 'monthly':
                minimumTime -= Date.UTC(1970, 0, 29);
                break;
            case 'daily':
                minimumTime -= Date.UTC(1970, 0, 2);
                break;
            case 'hourly':
                minimumTime -= Date.UTC(1970, 0, 1, 1);
                break;
        }

        if (configuration.lastCheck > minimumTime) {

            LogLib.message('Skipping package validation');

            resolve();

            return;
        }

        LogLib.message('Validating packages...');

        ProcessLib.exec('npm i')
            .then(() => {

                configuration.lastCheck = now;

                LogLib.success('Validated packages');

                FS.writeFileSync(
                    CONFIGURATION_FILE, JSON.stringify(configuration)
                );
            })
            .then(resolve)
            .catch(reject);
    });
}

Gulp.task('update', task);
