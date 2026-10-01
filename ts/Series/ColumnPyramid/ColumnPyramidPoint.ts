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

import type ColumnPoint from '../Column/ColumnPoint.js';
import type ColumnPyramidPointOptions from './ColumnPyramidPointOptions.js';
import type ColumnPyramidSeries from './ColumnPyramidSeries.js';

/* *
 *
 *  Class
 *
 * */

declare class ColumnPyramidPoint extends ColumnPoint {
    public options: ColumnPyramidPointOptions;
    /** @internal */
    public series: ColumnPyramidSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPyramidPoint;
