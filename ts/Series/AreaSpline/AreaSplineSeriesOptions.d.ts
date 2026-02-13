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

import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type SplineSeriesOptions from '../Spline/SplineSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface AreaSplineSeriesOptions extends SplineSeriesOptions {
    states?: SeriesStatesOptions<AreaSplineSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplineSeriesOptions;
