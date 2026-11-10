/* *
 *
 *  Vector plot series module
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
