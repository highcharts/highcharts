/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
