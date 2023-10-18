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
 * Creates minified versions of `.src.js` bundles in `/code` folder.
 * @return {Promise}
 * Promise to keep
 */
async function distMinify() {

    const scriptsCompile = require('../scripts-compile');
    const config = require('./_config.json');

    return await scriptsCompile(void 0, config);
}

gulp.task('dashboards/dist-minify', distMinify);

/* *
 *
 *  Default Export
 *
 * */

module.exports = distMinify;
