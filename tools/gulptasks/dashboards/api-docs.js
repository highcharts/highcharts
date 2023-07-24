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
    const fsLib = require('../lib/fs');
    const processLib = require('../lib/process');

    await fsLib.deleteDirectory('build/api/dashboards', true);
    await processLib.exec(
        'npx typedoc' +
        ' --options tools/gulptasks/dashboards/api-docs.json' +
        ' --tsconfig ts/masters-dashboards/tsconfig.json'
    );

    fsLib.copyAllFiles(
        'tools/gulptasks/dashboards/api-docs/',
        'build/api/dashboards/',
        true
    );
}

gulp.task('dashboards/api-docs', gulp.series('scripts', apiDocs));
