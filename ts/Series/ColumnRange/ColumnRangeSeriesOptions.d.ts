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

interface ColumnRangeSeriesOptions extends AreaRangeSeriesOptions {
    minPointLength?: number;
    states?: SeriesStatesOptions<ColumnRangeSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnRangeSeriesOptions;
