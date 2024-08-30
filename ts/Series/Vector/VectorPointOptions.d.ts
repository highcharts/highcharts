/* *
 *
 *  Vector plot series module
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

import type ScatterPointOptions from '../Scatter/ScatterPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface VectorPointOptions extends ScatterPointOptions {

    /**
     * The vector direction in degrees, where 0 is north (pointing towards
     * south).
     *
     * @product highcharts highstock
     */
    direction?: number;

    /**
     * The length of the vector. The rendered length will relate to the
     * `vectorLength` setting.
     *
     * @product highcharts highstock
     */
    length?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default VectorPointOptions;
