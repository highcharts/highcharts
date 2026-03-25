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
import type AreaSeriesOptions from '../Area/AreaSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface AreaSplineSeriesOptions extends AreaSeriesOptions {
    states?: SeriesStatesOptions<AreaSplineSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplineSeriesOptions;
