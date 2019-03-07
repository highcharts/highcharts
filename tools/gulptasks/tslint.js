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
 * Lint test of TypeScript code.
 *
 * @return {Promise<string>}
 *         Promise to keep with console output
 */
function task() {

    const Glob = require('glob');
    const Path = require('path');
    const ProcessLib = require('./lib/process');

    return Promise.all(
        Glob.sync(Path.join('ts', 'masters', 'tsconfig-*.json'))
            .map(file => ProcessLib.exec(
                'npx tslint --project ' + file
            ))
    );
}

Gulp.task('tslint', task);
