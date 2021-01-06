/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type AreaRangeSeriesOptions from '../AreaRange/AreaRangeSeriesOptions';
import type ColumnRangeSeries from './ColumnRangeSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

interface ColumnRangeSeriesOptions extends AreaRangeSeriesOptions {
    minPointLength?: number;
    states?: SeriesStatesOptions<ColumnRangeSeries>;
}

/* *
 *
 *  Default export
 *
 * */

export default ColumnRangeSeriesOptions;
