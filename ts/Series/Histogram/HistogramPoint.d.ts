/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Sebastian Domas
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

import type ColumnPointType from '../Column/ColumnPoint';
import type HistogramPointOptions from './HistogramPointOptions';
import type HistogramSeries from './HistogramSeries';

/* *
 *
 *  Class
 *
 * */

declare class HistogramPoint extends ColumnPointType {
    public options: HistogramPointOptions;
    public series: HistogramSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default HistogramPoint;
