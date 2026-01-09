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

import type AreaRangeSeriesOptions from '../AreaRange/AreaRangeSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface AreaSplineRangeSeriesOptions extends AreaRangeSeriesOptions {
    states?: SeriesStatesOptions<AreaSplineRangeSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplineRangeSeriesOptions;
