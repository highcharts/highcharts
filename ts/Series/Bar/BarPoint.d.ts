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

import type BarPointOptions from './BarPointOptions';
import type BarSeries from './BarSeries';
import type ColumnPoint from '../Column/ColumnPoint';

/* *
 *
 *  Class
 *
 * */

declare class BarPoint extends ColumnPoint {
    public options: BarPointOptions;
    public series: BarSeries;
}

/* *
 *
 *  Export Default
 *
 * */

export default BarPoint;
