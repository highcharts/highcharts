/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Sync from '../../Sync/Sync';
import NavigatorCrossfilterSync from './NavigatorCrossfilterSync.js';
import NavigatorExtremesSync from './NavigatorExtremesSync.js';


/* *
*
*  Constants
*
* */

const predefinedSyncConfig: Sync.PredefinedSyncConfig = {
    defaultSyncPairs: {
        crossfilter: NavigatorCrossfilterSync.syncPair,
        extremes: NavigatorExtremesSync.syncPair
    },
    defaultSyncOptions: {
        crossfilter: NavigatorCrossfilterSync.defaultOptions,
        extremes: NavigatorExtremesSync.defaultOptions
    }
};

/* *
 *
 *  Default export
 *
 * */
export default predefinedSyncConfig;
