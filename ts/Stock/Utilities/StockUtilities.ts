/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart';
import U from '../../Core/Utilities.js';
const {
    defined
} = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Sets the chart.fixedRange to the specified value. If the value is larger
 * than actual range, sets it to the maximum possible range. (#20327)
 *
 * @private
 * @function Highcharts.StockChart#setFixedRange
 * @param {number|undefined} range
 *        Range to set in axis units.
 */
function setFixedRange(this: Chart, range: number | undefined): void {
    const xAxis = this.xAxis[0];
    if (
        defined(xAxis.dataMax) &&
        defined(xAxis.dataMin) &&
        range
    ) {
        this.fixedRange = Math.min(range, xAxis.dataMax - xAxis.dataMin);
    } else {
        this.fixedRange = range;
    }
}

const StockUtilities = {
    setFixedRange
};

export default StockUtilities;
