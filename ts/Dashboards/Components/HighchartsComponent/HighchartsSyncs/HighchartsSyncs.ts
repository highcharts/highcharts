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
import HighchartsExtremesSync from './HighchartsExtremesSync.js';
import HighchartsHighlightSync from './HighchartsHighlightSync.js';
import HighchartsVisibilitySync from './HighchartsVisibilitySync.js';


/* *
*
*  Constants
*
* */

const predefinedSyncConfig: Sync.PredefinedSyncConfig = {
    defaultSyncPairs: {
        extremes: HighchartsExtremesSync.syncPair,
        highlight: HighchartsHighlightSync.syncPair,
        visibility: HighchartsVisibilitySync.syncPair
    },
    defaultSyncOptions: {
        extremes: HighchartsExtremesSync.defaultOptions,
        highlight: HighchartsHighlightSync.defaultOptions,
        visibility: HighchartsVisibilitySync.defaultOptions
    }
};


/* *
 *
 *  Default export
 *
 * */
export default predefinedSyncConfig;
