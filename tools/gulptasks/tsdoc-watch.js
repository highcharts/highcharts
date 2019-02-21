/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define:off */

const Gulp = require('gulp');

/**
 * Continuesly watching sources to restart the `tsdoc` task.
 *
 * @return {void}
 */
function tsdocWatch() {

    const Log = require('./lib/log');
    const Path = require('path');
    const TSDoc = require('./tsdoc');

    Log.warn('Watching', TSDoc.SOURCE_PATH, '...');
    Log.warn('Watching', TSDoc.TEMPLATE_PATH, '...');

    Gulp.watch(
        [
            Path.join(TSDoc.SOURCE_PATH, '**', '*'),
            Path.join(TSDoc.TEMPLATE_PATH, '**', '*')
        ],
        Gulp.task('tsdoc')
    );
}

Gulp.task('tsdoc-watch', tsdocWatch);
