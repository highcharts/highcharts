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

import type {
    RangeModifierRangeOptions
} from '../../../../Data/Modifiers/RangeModifierOptions';


/* *
*
*  Namespace
*
* */
namespace NavigatorSyncUtils {

    /* *
    *
    *  Utility Functions
    *
    * */

    /** @internal */
    export function setRangeOptions(
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
    export function unsetRangeOptions(
        ranges: Array<RangeModifierRangeOptions>,
        column: string
    ): (RangeModifierRangeOptions | undefined) {
        for (let i = 0, iEnd = ranges.length; i < iEnd; ++i) {
            if (ranges[i].column === column) {
                return ranges.splice(i, 1)[0];
            }
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */
export default NavigatorSyncUtils;
