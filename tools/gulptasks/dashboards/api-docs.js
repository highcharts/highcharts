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

    await fsLib.deleteDirectory('build/api/dashboards-1', true);
    await processLib.exec('npx jsdoc -c tools/dashboards/jsdoc.json code/es-modules/Dashboards/ code/es-modules/Data/');

    await fsLib.deleteDirectory('build/api/dashboards-2', true);
    await processLib.exec('npx typedoc --options tools/dashboards/typedoc.json --tsconfig ts/tsconfig.json');

    await fsLib.deleteDirectory('build/api/dashboards-3', true);
    await processLib.exec('npx jsdoc -c tools/dashboards/jsdoc-clean.json code/es-modules/Dashboards/ code/es-modules/Data/');

    await fsLib.deleteDirectory('build/api/dashboards-4', true);
    await processLib.exec('npx jsdoc -c tools/dashboards/jsdoc-better.json code/es-modules/Dashboards/ code/es-modules/Data/');
}

gulp.task('dashboards/api-docs', gulp.series('scripts', apiDocs));
