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

import type AreaSplineSeries from './AreaSplineSeries';
import type {
    SeriesOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type { SplineSeriesPlotOptions } from '../Spline/SplineSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface AreaSplineSeriesOptions
    extends SeriesOptions, AreaSplineSeriesPlotOptions
{
    // nothing to add
}

export interface AreaSplineSeriesPlotOptions extends SplineSeriesPlotOptions {
    states?: SeriesStatesOptions<AreaSplineSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplineSeriesOptions;
