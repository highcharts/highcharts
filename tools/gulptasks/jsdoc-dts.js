/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');

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

    const HighchartsDeclarationsGenerator = require(
        '../../../highcharts-declarations-generator'
    );

    return new Promise((resolve, reject) => {

        HighchartsDeclarationsGenerator
            .task()
            .then(resolve)
            .catch(reject);
    });
}

require('./jsdoc-namespace');
require('./jsdoc-options');

Gulp.task('jsdoc-dts', Gulp.series('jsdoc-namespace', 'jsdoc-options', jsDocDTS));
