/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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
