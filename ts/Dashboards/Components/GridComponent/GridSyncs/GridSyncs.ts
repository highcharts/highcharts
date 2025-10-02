/* *
 *
 *  (c) 2009-2025 Highsoft AS
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
