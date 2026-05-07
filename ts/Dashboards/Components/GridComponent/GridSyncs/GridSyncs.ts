/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { PredefinedSyncConfig } from '../../Sync/Sync';
import GridExtremesSync from './GridExtremesSync.js';
import GridHighlightSync from './GridHighlightSync.js';
import GridVisibilitySync from './GridVisibilitySync.js';

/* *
*
*  Constants
*
* */
const predefinedSyncConfig: PredefinedSyncConfig = {
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
