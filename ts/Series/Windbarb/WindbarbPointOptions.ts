/* *
 *
 *  Wind barb series module
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
