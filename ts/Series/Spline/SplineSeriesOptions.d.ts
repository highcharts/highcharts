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

import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SplineSeriesOptions extends LineSeriesOptions {
    states?: SeriesStatesOptions<SplineSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default SplineSeriesOptions;
