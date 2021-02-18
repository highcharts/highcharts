/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Tasks
 *
 * */

/**
 * @return {Promise<void>}
 *         Promise to keep
 */
async function task() {

    const errorMessages = require('../error-messages.js'),
        processLib = require('./lib/process');
    processLib.isRunning('scripts-ts', true);

    try {
        await errorMessages();
        return processLib.exec('npx tsc --project ts');
    } catch (error) {
        processLib.isRunning('scripts-ts', false);
        throw (error);
    }

}

gulp.task('scripts-ts', task);
