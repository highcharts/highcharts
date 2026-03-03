/* *
 *
 *  Vector plot series module
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
