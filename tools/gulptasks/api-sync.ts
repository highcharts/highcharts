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

    // Arguments

    const postgres = (
        typeof args.postgres === 'string' ?
            args.postgres :
            gimp['apidoc.postgres']
    );
    const product = (
        typeof args.product === 'string' ?
            args.product :
            'highcharts'
    );

    // Database

    LogLib.warn('Loading API Database...');

    await itemMerger.mergeDatabase(postgres, product);
    const itemCount = Object.keys(itemMerger.mergedItems).length;

    if (itemCount) {
        LogLib.success(itemCount, 'item(s) found.');
    } else {
        LogLib.failure('No items found!');
    }

    // Declarations

    LogLib.warn('Merging \'code/es-modules/\'...');

    await itemMerger.mergeDeclarations('code/es-modules/', product);
    const mergeItemCount = Object.keys(itemMerger.mergedItems).length;

    if (mergeItemCount > itemCount) {
        LogLib.success(mergeItemCount - itemCount, 'item(s) added.');
    }

    if (itemCount) {
        LogLib.success(itemCount, 'item(s) merged.');
    }

}


/* *
 *
 *  Tasks
 *
 * */


Gulp.task('api-sync', Gulp.series('scripts', apiSync));
