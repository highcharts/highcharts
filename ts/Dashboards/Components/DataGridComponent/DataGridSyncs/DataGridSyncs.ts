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
import DataGridExtremesSync from './DataGridExtremesSync.js';
import DataGridHighlightSync from './DataGridHighlightSync.js';
import DataGridVisibilitySync from './DataGridVisibilitySync.js';

/* *
*
*  Namespace
*
* */
const predefinedSyncConfig: Sync.PredefinedSyncConfig = {
    defaultSyncPairs: {
        extremes: DataGridExtremesSync.syncPair,
        highlight: DataGridHighlightSync.syncPair,
        visibility: DataGridVisibilitySync.syncPair
    },
    defaultSyncOptions: {
        extremes: DataGridExtremesSync.defaultOptions,
        highlight: DataGridHighlightSync.defaultOptions,
        visibility: DataGridVisibilitySync.defaultOptions
    }
};


/* *
 *
 *  Default export
 *
 * */
export default predefinedSyncConfig;
