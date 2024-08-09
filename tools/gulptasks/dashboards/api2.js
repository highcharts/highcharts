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
    await processLib.exec('npx ts-node tools/api-docs/dashboards-options');
    await processLib.exec('npx ts-node tools/api-docs/server', { silent: 0 });

}

gulp.task('dashboards/api2', api2);
