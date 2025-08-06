/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Task
 *
 * */

async function apiDocs() {
    const fsLib = require('../../libs/fs');
    const processLib = require('../../libs/process');

    await fsLib.deleteDirectory('build/api/grid');
    await processLib.exec(
        'npx typedoc' +
        ' --options tools/gulptasks/grid/api-docs.json' +
        ' --tsconfig ts/masters-grid/tsconfig.json'
    );

    fsLib.copyAllFiles(
        'tools/gulptasks/dashboards/api-docs/',
        'build/api/grid/',
        true
    );

    fsLib.copyAllFiles(
        'tools/gulptasks/grid/api-docs/',
        'build/api/grid/',
        true
    );
}

gulp.task('grid/api-docs', gulp.series('scripts', apiDocs));
