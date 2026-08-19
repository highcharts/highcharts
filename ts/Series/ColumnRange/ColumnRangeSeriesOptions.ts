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

/**
 * The column range is a cartesian series type with higher and lower
 * Y values along an X axis. To display horizontal bars, set
 * [chart.inverted](#chart.inverted) to `true`.
 *
 * A `columnrange` series. If the [type](#series.columnrange.type)
 * option is not specified, it is inherited from
 * [chart.type](#chart.type).
 *
 * @sample {highcharts|highstock} highcharts/demo/columnrange/
 *         Inverted column range
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.columnrange
 *
 * @since 2.3.0
 *
 * @excluding dataParser, dataURL, softThreshold, stack,
 *            stacking, threshold
 *
 * @product highcharts highstock
 *
 * @requires highcharts-more
 */
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
