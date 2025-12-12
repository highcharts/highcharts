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

import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type SplineSeries from './SplineSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface SplineSeriesOptions extends LineSeriesOptions {
    states?: SeriesStatesOptions<SplineSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default SplineSeriesOptions;
