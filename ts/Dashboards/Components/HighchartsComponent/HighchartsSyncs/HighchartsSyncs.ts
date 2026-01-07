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
