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
import type AreaSplineSeries from '../AreaSpline/AreaSplineSeries.js';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface AreaSplineRangeSeriesOptions extends AreaRangeSeriesOptions {
    states?: SeriesStatesOptions<AreaSplineSeries>;
}

/* *
 *
 *  Default export
 *
 * */

export default AreaSplineRangeSeriesOptions;
