/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Task
 *
 * */

async function api2() {
    const fsLib = require('../../libs/fs');
    const processLib = require('../../libs/process');

    await fsLib.deleteFile('tree-database.json');
    await processLib.exec('node --import tsx tools/api-docs/dashboards-options.ts');
    await processLib.exec('node --import tsx tools/api-docs/server.ts', { silent: 0 });

}

gulp.task('dashboards/api2', api2);
