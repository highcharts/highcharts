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

import type DataTable from '../../../../Data/DataTable';
import type {
    RangeModifierOptions,
    RangeModifierRangeOptions
} from '../../../../Data/Modifiers/RangeModifierOptions';
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
*  Utility Functions
*
* */

/**
 * Utility function that returns the first row index
 * if the table has been modified by a range modifier
 *
 * @param {DataTable} table
 * The table to get the offset from.
     *
 * @param {RangeModifierOptions} modifierOptions
 * The modifier options to use
 *
 * @return {number}
 * The row offset of the modified table.
 */
function getModifiedTableOffset(
    table: DataTable,
    modifierOptions: RangeModifierOptions
): number {
    const { ranges } = modifierOptions;

    if (ranges) {
        const minRange = ranges.reduce(
            (minRange, currentRange): RangeModifierRangeOptions => {
                if (currentRange.minValue > minRange.minValue) {
                    minRange = currentRange;
                }
                return minRange;

            }, ranges[0]
        );

        const tableRowIndex = table.getRowIndexBy(
            minRange.column,
            minRange.minValue
        );

        if (tableRowIndex) {
            return tableRowIndex;
        }
    }

    return 0;
}


/* *
 *
 *  Default export
 *
 * */
export default { predefinedSyncConfig, getModifiedTableOffset };
