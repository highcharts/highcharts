/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
