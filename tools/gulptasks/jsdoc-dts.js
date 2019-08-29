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
 * Add TypeScript declarations to the code folder using tree.json and
 * tree-namespace.json.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function jsDocDTS() {

    const gulpLib = require('./lib/gulp');
    const highchartsDeclarationsGenerator = require(
        'highcharts-declarations-generator'
    );

    return new Promise((resolve, reject) => {

        gulpLib
            .requires([], ['jsdoc-namespace', 'jsdoc-options'])
            .then(() => highchartsDeclarationsGenerator.task())
            .then(resolve)
            .catch(reject);
    });
}

gulp.task('jsdoc-dts', jsDocDTS);
