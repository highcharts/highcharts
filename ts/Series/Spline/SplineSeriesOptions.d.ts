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

import type { LineSeriesPlotOptions } from '../Line/LineSeriesOptions';
import type {
    SeriesOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type SplineSeries from './SplineSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface SplineSeriesOptions
    extends SeriesOptions, SplineSeriesPlotOptions
{
    // nothing to add
}

export interface SplineSeriesPlotOptions extends LineSeriesPlotOptions {
    states?: SeriesStatesOptions<SplineSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default SplineSeriesOptions;
