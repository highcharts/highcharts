/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
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
     * The high or maximum value for each data point.
     *
     * @type {number}
     *
     * @product highcharts highstock
     */
    high?: number;

    /**
     * The low or minimum value for each data point.
     *
     * @type {number}
     *
     * @product highcharts highstock
     *
     * @apioption series.arearange.data.low
     */
    low?: number;

}

/* *
 *
 *  Default export
 *
 * */

export default AreaRangePointOptions;
