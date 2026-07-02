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
 * Generate Grid runtime metadata for deprecated options.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function generateDeprecatedOptions() {
    const processLib = require('../../libs/process');

    await processLib.exec(
        'npx ts-node tools/api-docs/grid-deprecated-options.ts --source "ts/Grid"'
    );
}

gulp.task('grid/deprecated-options', generateDeprecatedOptions);
