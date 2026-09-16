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

import type ColumnPoint from '../Column/ColumnPoint';
import type ColumnPyramidPointOptions from './ColumnPyramidPointOptions';
import type ColumnPyramidSeries from './ColumnPyramidSeries';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class ColumnPyramidPoint extends ColumnPoint {
    public options: ColumnPyramidPointOptions;
    public series: ColumnPyramidSeries;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ColumnPyramidPoint;
