/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable func-style, no-use-before-define, quotes */


/* *
 *
 *  Imports
 *
 * */


const Gulp = require('gulp');


/* *
 *
 *  Constants
 *
 * */


const INFO = `
npx gulp api-docs [OPTIONS]

OPTIONS:
  --info           This information.
  --debug          Includes source code of the related node.
  --source [PATH]  Only loads source files from the given path. (recursive)
`;


/* *
 *
 *  Functions
 *
 * */


/**
 * Creates API docs.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function apiDocs() {
    const ProcessLib = require('../libs/process');
    const Yargs = require('yargs');

    const args = Yargs.argv;

    if (args.info) {
        process.stdout.write(INFO);
        return;
    }

    const source = (args.source || 'ts');

    await Gulp.task('api-tree')();

    await ProcessLib.exec(
        'tools/api-docs/bin/api-classes.ts' +
            ` --source "${source}"`
    );
    await ProcessLib.exec(
        'tools/api-docs/bin/api-options.ts' +
            ` --source "${source}"`
    );
}


/* *
 *
 *  Tasks
 *
 * */

require('./api-tree');

Gulp.task('api-docs', apiDocs);
