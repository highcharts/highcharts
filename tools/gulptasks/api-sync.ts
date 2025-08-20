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
import Path from 'node:path';


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
    const props = await APIDoc.getProperties();

    // Arguments

    const options = {
        declarationsFolder: (
            typeof args.declarations === 'string' ?
                args.declarations :
                Path.join('code', 'es-modules')
        ),
        postgres: (
            typeof args.postgres === 'string' ?
                args.postgres :
                props['apidoc.postgres']
        ),
        productNamespace: (
            typeof args.namespace === 'string' ?
                args.namespace :
                'Highcharts'
        ),
        productURLName: (
            typeof args.product === 'string' ?
                args.product :
                'highcharts'
        ),
        release: (
            typeof args.release === 'string' ?
                args.release :
                require('../../build-properties.json').version
        )
    };

    const mergerSession = await APIDoc.MergerSession.createMergerSession(
        options.postgres,
        options.declarationsFolder,
        options.productNamespace,
        options.productURLName,
        options.release
    );

    // Database

    LogLib.warn('Loading API Database...');

    await mergerSession.mergeDatabase();
    const itemCount = Object.keys(mergerSession.mergedItems).length;

    if (itemCount) {
        LogLib.success(itemCount, 'item(s) found.');
    } else {
        LogLib.failure('No items found!');
    }

    // Declarations

    LogLib.warn('Merging \'code/es-modules/\'...');

    await mergerSession.mergeDeclarations();
    const mergeItemCount = Object.keys(mergerSession.mergedItems).length;

    if (mergeItemCount > itemCount) {
        LogLib.success(mergeItemCount - itemCount, 'item(s) added.');
    }

    if (itemCount) {
        LogLib.success(itemCount, 'item(s) merged.');
    }

    LogLib.warn('Saving merged items...');

    await mergerSession.saveToDatabase();

}


/* *
 *
 *  Tasks
 *
 * */


Gulp.task('api-sync', Gulp.series('scripts', apiSync));
