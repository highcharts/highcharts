/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2021 Torstein Honsi, Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type XRangePointPartialFillOptions from './XRangePointOptions';
import type XRangeSeries from './XRangeSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */
export interface XRangeSeriesOptions extends ColumnSeriesOptions {
    partialFill?: XRangePointPartialFillOptions;
    states?: SeriesStatesOptions<XRangeSeries>;
}

/* *
 *
 *  Default Export
 *
 * */
export default XRangeSeriesOptions;
