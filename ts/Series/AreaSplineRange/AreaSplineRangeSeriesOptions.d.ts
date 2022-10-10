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

import type {
    AreaRangeSeriesPlotOptions
} from '../AreaRange/AreaRangeSeriesOptions';
import type AreaSplineSeries from '../AreaSpline/AreaSplineSeries.js';
import type {
    SeriesOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface AreaSplineRangeSeriesOptions
    extends SeriesOptions, AreaSplineRangeSeriesPlotOptions
{
    dataLabels?: AreaRangeSeriesPlotOptions['dataLabels'];
}

export interface AreaSplineRangeSeriesPlotOptions
    extends AreaRangeSeriesPlotOptions
{
    states?: SeriesStatesOptions<AreaSplineSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplineRangeSeriesOptions;
