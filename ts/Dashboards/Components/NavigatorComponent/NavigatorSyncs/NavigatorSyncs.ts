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
import type {
    RangeModifierRangeOptions
} from '../../../../Data/Modifiers/RangeModifierOptions';
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
*  Utility Functions
*
* */

/** @internal */
function setRangeOptions(
    ranges: Array<RangeModifierRangeOptions>,
    column: string,
    minValue: (boolean | number | string),
    maxValue: (boolean | number | string)
): void {
    let changed = false;

    for (let i = 0, iEnd = ranges.length; i < iEnd; ++i) {
        if (ranges[i].column === column) {
            ranges[i].maxValue = maxValue;
            ranges[i].minValue = minValue;
            changed = true;
            break;
        }
    }

    if (!changed) {
        ranges.push({ column, maxValue, minValue });
    }
}


/** @internal */
function unsetRangeOptions(
    ranges: Array<RangeModifierRangeOptions>,
    column: string
): (RangeModifierRangeOptions | undefined) {
    for (let i = 0, iEnd = ranges.length; i < iEnd; ++i) {
        if (ranges[i].column === column) {
            return ranges.splice(i, 1)[0];
        }
    }
}

/* *
 *
 *  Default export
 *
 * */
export default { predefinedSyncConfig, setRangeOptions, unsetRangeOptions };
