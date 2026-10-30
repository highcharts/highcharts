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

import type DumbbellPointOptions from '../Dumbbell/DumbbellPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface LollipopPointOptions extends DumbbellPointOptions {

    /**
     * The high value of the point. Not applicable to lollipop, which has a
     * single value per point.
     */
    high?: undefined;

    /**
     * The low value of the point. Not applicable to lollipop, which has a
     * single value per point.
     */
    low?: undefined;

    /**
     * Color of the start markers. Not applicable to lollipop, which has a
     * single marker per point.
     */
    lowColor?: undefined;

    /**
     * A pixel value specifying a fixed width for the lollipop column.
     *
     * @product highcharts highstock
     */
    pointWidth?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default LollipopPointOptions;
