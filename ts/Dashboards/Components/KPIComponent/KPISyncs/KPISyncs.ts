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
import KPIExtremesSync from './KPIExtremesSync.js';


/* *
*
*  Constants
*
* */

const predefinedSyncConfig: Sync.PredefinedSyncConfig = {
    defaultSyncPairs: {
        extremes: KPIExtremesSync.syncPair
    },
    defaultSyncOptions: {
        extremes: KPIExtremesSync.defaultOptions
    }
};


/* *
 *
 *  Default export
 *
 * */
export default predefinedSyncConfig;
