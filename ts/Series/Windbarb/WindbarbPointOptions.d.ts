/* *
 *
 *  Wind barb series module
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

import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface WindbarbPointOptions extends ColumnPointOptions {

    /**
     * The wind direction in degrees, where 0 is north (pointing towards south).
     *
     * @product highcharts highstock
     */
    direction?: number;

    /**
     * The wind speed in meters per second.
     *
     * @product highcharts highstock
     */
    value?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default WindbarbPointOptions;
