/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const WATCH_GLOBS = [
    'ts/**/*.ts'
];

/* *
 *
 *  Tasks
 *
 * */

/**
 * Continuesly watching sources to restart the `api-docs` task.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDocWatch() {

    const Log = require('../libs/log');

    return new Promise(resolve => {

        Gulp
            .watch(
                WATCH_GLOBS,
                {
                    delay: 5000
                },
                Gulp.task('api-docs')
            )
            .on(
                'change',
                filePath => {
                    Log.warn('Modified', filePath);
                }
            );

        Log.warn('Watching', WATCH_GLOBS[0], '...');

        Gulp.task('api-server')();

        resolve();
    });
}

require('./api-docs');
require('./api-server');

Gulp.task('api', Gulp.series('api-tree', 'api-docs', jsDocWatch));
