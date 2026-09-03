/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A bar series is a special type of column series where the columns are
 * horizontal.
 *
 * A `bar` series. If the [type](#series.bar.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/bar-chart/
 *         Bar chart
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.bar
 *
 * @product highcharts
 *
 * @exclude connectNulls, dashStyle, dataParser, dataURL, gapSize, gapUnit,
 *          linecap, lineWidth, marker, connectEnds, step
 */
export interface BarSeriesOptions extends ColumnSeriesOptions {
    // Nothing here yet
}

/* *
 *
 *  Default Export
 *
 * */

export default BarSeriesOptions;
