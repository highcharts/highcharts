/* *
 *
 *  (c) 2010-2025 Highsoft AS
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
 *  Default Export
 *
 * */

export default AreaSplineRangeSeriesOptions;
