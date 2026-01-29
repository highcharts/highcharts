/* *
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

import type ColumnPoint from '../Column/ColumnPoint';
import type ColumnPyramidPointOptions from './ColumnPyramidPointOptions';
import type ColumnPyramidSeries from './ColumnPyramidSeries';

/* *
 *
 *  Class
 *
 * */

declare class ColumnPyramidPoint extends ColumnPoint {
    public options: ColumnPyramidPointOptions;
    public series: ColumnPyramidSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPyramidPoint;
