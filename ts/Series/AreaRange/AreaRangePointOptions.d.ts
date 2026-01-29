/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
     *
     * @extends series.arearange.dataLabels
     *
     * @product highcharts highstock
     *
     * @apioption series.arearange.data.dataLabels
     */

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
