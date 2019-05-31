/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const path = require('path');

/* *
 *
 *  Constants
 *
 * */

const CONFIGURATION_FILE = path.join('node_modules', '_gulptasks_update.json');

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

    const fs = require('fs');
    const logLib = require('./lib/log');
    const processLib = require('./lib/process');

    return new Promise((resolve, reject) => {

        const now = (new Date()).getTime();

        let configuration = {
            checkFrequency: 'weekly',
            lastCheck: 0
        };

        if (fs.existsSync(CONFIGURATION_FILE)) {
            configuration = JSON.parse(
                fs.readFileSync(CONFIGURATION_FILE).toString()
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

            logLib.message('Skipping package validation');

            resolve();

            return;
        }

        logLib.message('Validating packages...');

        processLib.exec('npm i')
            .then(() => {

                configuration.lastCheck = now;

                logLib.success('Validated packages');

                fs.writeFileSync(
                    CONFIGURATION_FILE, JSON.stringify(configuration)
                );
            })
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('update', task);
