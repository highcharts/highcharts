/* *
 *
 *  Wind barb series module
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
