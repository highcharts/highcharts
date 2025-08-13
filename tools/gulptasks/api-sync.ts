/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable func-style, no-use-before-define, quotes */


/* *
 *
 *  Imports
 *
 * */


import Gulp from 'gulp';


/* *
 *
 *  Functions
 *
 * */


/**
 * Updates API backend with latest declarations.
 *
 * @return
 * Promise to keep.
 */
async function apiSync(): Promise<void> {
    const APIDoc = require('../apidoc/index');
    const LogLib = require('../libs/log');

    const args = APIDoc.getArgs();
    const gimp = await APIDoc.getGitIgnoreMeProperties();
    const itemMerger = new APIDoc.ItemMerger();

    LogLib.warn('Loading \'code/es-modules/\'...');

    await itemMerger.mergeDeclarations('code/es-modules/');
    console.log(Object.keys(itemMerger.mergedItems));

    LogLib.warn('Loading API Database...');

    await itemMerger.mergeDatabase(
        gimp['apidoc.postgres'],
        typeof args.product === 'string' ? args.product : 'highcharts'
    );
    console.log(Object.keys(itemMerger.mergedItems));

}


/* *
 *
 *  Tasks
 *
 * */


Gulp.task('api-sync', Gulp.series('scripts', apiSync));
