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
import GridExtremesSync from './GridExtremesSync.js';
import GridHighlightSync from './GridHighlightSync.js';
import GridVisibilitySync from './GridVisibilitySync.js';

/* *
*
*  Namespace
*
* */
const predefinedSyncConfig: Sync.PredefinedSyncConfig = {
    defaultSyncPairs: {
        extremes: GridExtremesSync.syncPair,
        highlight: GridHighlightSync.syncPair,
        visibility: GridVisibilitySync.syncPair
    },
    defaultSyncOptions: {
        extremes: GridExtremesSync.defaultOptions,
        highlight: GridHighlightSync.defaultOptions,
        visibility: GridVisibilitySync.defaultOptions
    }
};


/* *
 *
 *  Default export
 *
 * */
export default predefinedSyncConfig;
