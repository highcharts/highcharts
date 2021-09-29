/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AreaPointOptions from '../Area/AreaPointOptions';

/* *
 *
 *  Declaration
 *
 * */

export interface AreaRangePointOptions extends AreaPointOptions {
    /**
     * Range series only. The high or maximum value for each data point.
     * @name Highcharts.Point#high
     * @type {number|undefined}
     */
    high?: number;
    /**
     * Range series only. The low or minimum value for each data point.
     * @name Highcharts.Point#low
     * @type {number|undefined}
     */
    low?: number;
}

/* *
 *
 *  Default export
 *
 * */

export default AreaRangePointOptions;
