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

import type ErrorBarSeries from './ErrorBarSeries';
import type BoxPlotSeriesOptions from '../BoxPlot/BoxPlotSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */
export interface ErrorBarSeriesOptions extends BoxPlotSeriesOptions {
    states?: SeriesStatesOptions<ErrorBarSeries>;
    whiskerWidth?: number;
}

/* *
 *
 *  Export
 *
 * */

export default ErrorBarSeriesOptions;
