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
import KPIExtremesSync from './KPIExtremesSync.js';


/* *
*
*  Constants
*
* */

const predefinedSyncConfig: PredefinedSyncConfig = {
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
